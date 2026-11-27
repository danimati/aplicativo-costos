P = "PRY-2024-089"

FRONT_GETS = [
    "/api/projects", f"/api/projects/{P}", "/api/projects/calendar",
    f"/api/projects/{P}/bom", "/api/catalog/materials", "/api/catalog/providers", "/api/notifications",
    f"/api/projects/{P}/notes", f"/api/projects/{P}/documents", f"/api/projects/{P}/labor-stages",
    f"/api/projects/{P}/template", f"/api/projects/{P}/procurement", f"/api/projects/{P}/reception",
    f"/api/projects/{P}/fabricacion", f"/api/projects/{P}/ensamble", f"/api/projects/{P}/instalacion",
    f"/api/projects/{P}/cableado", f"/api/projects/{P}/programacion", f"/api/projects/{P}/pruebas",
    f"/api/projects/{P}/cost-inputs", f"/api/projects/{P}/reports/avance", f"/api/projects/{P}/reports/costos",
    f"/api/projects/{P}/reports/horas", f"/api/projects/{P}/reports/indicadores",
]


def test_all_frontend_gets_respond(client):
    for url in FRONT_GETS:
        r = client.get(url)
        assert r.status_code == 200, (url, r.text)


def test_project_shape_is_camel_case(client):
    p = client.get(f"/api/projects/{P}").json()
    assert {"cutDate", "startDate", "endDate", "navTemplate", "stages"} <= p.keys()
    assert p["stages"][0] == {"id": "01", "name": "Ingeniería & Estimación", "status": "COMPLETADO",
                              "progress": 100, "owner": "AM", "dueDate": "12 AGO 2026"}
    assert p["navTemplate"][0]["leaves"][0]["route"] == "documentacion"
    assert [x["id"] for x in client.get("/api/projects").json()][:2] == [P, "PRY-2024-076"]


def test_unknown_project_404(client):
    assert client.get("/api/projects/NOPE").status_code == 404
    assert client.get("/api/projects/NOPE/bom").status_code == 404


def test_template_null_and_cost_default(client):
    assert client.get("/api/projects/PRY-2024-061/template").json() is None
    assert client.get("/api/projects/PRY-2024-061/cost-inputs").json() == {
        "projectId": "PRY-2024-061", "fixedCosts": 0, "variableCosts": 0, "indirectCosts": 0, "marginPercent": 0}


def test_cost_report(client):
    r = client.get(f"/api/projects/{P}/reports/costos").json()
    assert r["materials"] == 22564  # suma de subtotales de la BOM
    assert r["labor"] == 8 * 45000 + 24 * 55000 + 40 * 38000 + 16 * 50000 + 20 * 42000 + 10 * 60000
    assert r["totalCost"] == r["materials"] + r["labor"] + 3200000 + 1450000 + 980000
    assert abs(r["finalEstimatedValue"] - r["totalCost"] * 1.22) < 1e-6


def test_avance_report(client):
    r = client.get(f"/api/projects/{P}/reports/avance").json()
    assert [c["cycle"] for c in r["cycles"]] == ["CICLO I", "CICLO II", "CICLO III"]
    assert "Bloqueado: Conjunto de campo (bornes de salida)" in r["blockers"]
    assert len(r["milestones"]) == 4


def test_notes_crud(client):
    created = client.post(f"/api/projects/{P}/notes", json={"projectId": P, "date": "2026-11-26", "content": "x"})
    assert created.status_code == 201
    nid = created.json()["id"]
    upd = client.patch(f"/api/notes/{nid}", json={"content": "y"}).json()
    assert upd["content"] == "y" and upd["projectId"] == P
    assert client.delete(f"/api/notes/{nid}").status_code == 204
    assert all(n["id"] != nid for n in client.get(f"/api/projects/{P}/notes").json())


def test_documents_crud_sets_updated_at(client):
    doc = client.post(f"/api/projects/{P}/documents", json={
        "projectId": P, "title": "T", "kind": "markdown", "content": "# a", "updatedAt": "2026-01-01T00:00:00.000Z",
    }).json()
    upd = client.patch(f"/api/documents/{doc['id']}", json={"title": "T2"}).json()
    assert upd["title"] == "T2" and upd["updatedAt"] != "2026-01-01T00:00:00.000Z"
    assert client.delete(f"/api/documents/{doc['id']}").status_code == 204


def test_notifications(client):
    assert client.patch("/api/notifications/NOT-001/read", json={}).status_code == 204
    n = {x["id"]: x["read"] for x in client.get("/api/notifications").json()}
    assert n["NOT-001"] and not n["NOT-002"]
    assert client.patch("/api/notifications/read-all", json={}).status_code == 204
    assert all(x["read"] for x in client.get("/api/notifications").json())


def test_generic_collection_crud_and_validation(client):
    url = f"/api/projects/{P}/labor-stages"
    bad = client.post(url, json={"name": "X", "estimatedHours": 1, "hourlyRate": 1, "owner": "A", "status": "MAL"})
    assert bad.status_code == 422
    new = client.post(url, json={"name": "X", "estimatedHours": 2, "hourlyRate": 10, "owner": "A",
                                 "status": "PENDIENTE"}).json()
    assert new["projectId"] == P and new["id"].startswith("lb")
    assert client.patch(f"{url}/{new['id']}", json={"status": "EN PROCESO"}).json()["status"] == "EN PROCESO"
    horas = client.get(f"/api/projects/{P}/reports/horas").json()
    assert horas["totalHours"] == 118 + 2
    assert client.delete(f"{url}/{new['id']}").status_code == 204


def test_delete_project_cascades(client):
    pid = "PRY-2024-076"
    assert client.get(f"/api/projects/{pid}/labor-stages").json()
    assert client.delete(f"/api/projects/{pid}").status_code == 204
    assert client.get(f"/api/projects/{pid}").status_code == 404
    from app.db import SessionLocal
    from app import models
    with SessionLocal() as db:
        assert db.query(models.LaborStage).filter_by(project_id=pid).count() == 0
        assert db.query(models.BomMaterial).filter_by(project_id=pid).count() == 0
