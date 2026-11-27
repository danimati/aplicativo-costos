#!/usr/bin/env python3
"""Compila la documentación Markdown de docs/ a PDF.

Genera en docs/pdf/:
  - un PDF por documento (01-vision-general.pdf … 08-trazabilidad.pdf)
  - Documentacion-Costos-Industrial.pdf (portada + índice + todos los documentos)

Uso:  python3 docs/exportar/generar_pdf.py      (o `make docs-pdf` desde despliegue/)
Requiere: Python 3 con `markdown` y `websockets`, `pdfunite` (poppler-utils) y Docker (Chromium headless, imagen
zenika/alpine-chrome, controlada por el protocolo DevTools). Usa las fuentes del sistema (Noto Sans / Serif / Mono / Color Emoji).
"""

from __future__ import annotations

import html
import os
import re
import shutil
import subprocess
import sys
from datetime import date
from pathlib import Path

import markdown

DOCS = Path(__file__).resolve().parents[1]
BUILD = DOCS / "exportar" / "build"
OUT = DOCS / "pdf"
CSS = (DOCS / "exportar" / "estilo.css").read_text(encoding="utf-8")
IMAGE = "zenika/alpine-chrome:124"
FONTS_DIR = "/usr/share/fonts"

TITULO = "Costos Industrial"
SUBTITULO = "Módulo de Costos para proyectos de automatización industrial"
VERSION = "Versión 1.0"
FECHA = date.today()
MESES = "enero febrero marzo abril mayo junio julio agosto septiembre octubre noviembre diciembre".split()
FECHA_TXT = f"{MESES[FECHA.month - 1].capitalize()} {FECHA.year}"

# (archivo, clave corta, título en encabezado)
DOCUMENTOS = [
    ("01-vision-general.md", "d1", "1. Visión general"),
    ("02-casos-de-uso.md", "d2", "2. Casos de uso"),
    ("03-arquitectura-y-diseno.md", "d3", "3. Arquitectura y diseño"),
    ("04-referencia-api.md", "d4", "4. Referencia del API"),
    ("05-manual-instalacion.md", "d5", "5. Manual de instalación"),
    ("06-manual-usuario.md", "d6", "6. Manual de usuario"),
    ("07-manual-funcional.md", "d7", "7. Manual de funcionalidad"),
    ("08-trazabilidad.md", "d8", "8. Matriz de trazabilidad"),
]
CLAVE = {f: k for f, k, _ in DOCUMENTOS}


def slug(texto: str) -> str:
    """Slug estilo GitHub/Bitbucket: minúsculas, sin puntuación, espacios → guiones."""
    texto = re.sub(r"<[^>]+>", "", texto).strip().lower()
    texto = re.sub(r"[^\w\s-]", "", texto, flags=re.UNICODE)
    return re.sub(r"\s", "-", texto)


def a_html(archivo: str, consolidado: bool) -> tuple[str, list[tuple[int, str, str]]]:
    """Convierte un .md a HTML. Devuelve (html, [(nivel, id, texto)]) para el índice."""
    clave = CLAVE[archivo]
    texto = (DOCS / archivo).read_text(encoding="utf-8")
    texto = re.sub(r"^\[← Índice\]\(README\.md\)\s*$", "", texto, flags=re.M)

    md = markdown.Markdown(
        extensions=["tables", "fenced_code", "sane_lists", "attr_list", "toc"],
        extension_configs={"toc": {"slugify": lambda v, _sep: f"{clave}-{slug(v)}", "toc_depth": "1-3"}},
    )
    cuerpo = md.convert(texto)
    encabezados = [(t["level"], t["id"], t["name"]) for t in _aplanar(md.toc_tokens)]

    def enlace(m: re.Match[str]) -> str:
        destino, ancla = m.group(1), m.group(2) or ""
        if destino.endswith(".md") and destino in CLAVE:
            k = CLAVE[destino]
            if consolidado or k == clave:
                return f'href="#{k}-{ancla[1:]}"' if ancla else f'href="#{k}"'
            return f'href="{destino[:-3]}.pdf"'
        if destino.startswith(("http", "mailto:", "#")):
            return m.group(0)
        return 'href="#"'  # carpetas o archivos del repo: sin destino en el PDF

    cuerpo = re.sub(r'href="([^"#]*)(#[^"]*)?"', lambda m: m.group(0) if m.group(1) == "" else enlace(m), cuerpo)
    cuerpo = cuerpo.replace('href="#"', "")  # deja el texto, quita el enlace muerto
    # Imágenes relativas a docs/ → relativas a docs/exportar/build/
    cuerpo = re.sub(r'src="(?!https?:|/)([^"]+)"', r'src="../../\1"', cuerpo)
    # Imágenes solas en un párrafo → figura (para centrar y evitar cortes de página)
    cuerpo = re.sub(r"<p>(<img [^>]+>)</p>", _figura, cuerpo)
    # Identificadores (CU-01, RE-040, RN-03, L-01…) con guion no separable: no se parten de línea
    cuerpo = re.sub(r">([^<]+)<", lambda m: ">" + re.sub(r"\b(CU|RE|RN|L)-(\d)", "\\1\u2011\\2", m.group(1)) + "<", cuerpo)
    return f'<section class="doc" id="{clave}">{cuerpo}</section>', encabezados


APAISADOS = ("casos-de-uso.svg", "componentes.svg")


def _figura(m: re.Match[str]) -> str:
    """Envuelve una imagen sola en <figure>; los diagramas anchos van en página apaisada."""
    img = m.group(1)
    if any(nombre in img for nombre in APAISADOS):
        return f'<figure class="apaisada">{img}</figure>'
    return f"<figure>{img}</figure>"


def _aplanar(tokens: list[dict]) -> list[dict]:
    salida: list[dict] = []
    for t in tokens:
        salida.append(t)
        salida.extend(_aplanar(t.get("children", [])))
    return salida


def portada(subtitulo_doc: str | None = None) -> str:
    extra = f'<p class="cover-doc">{html.escape(subtitulo_doc)}</p>' if subtitulo_doc else ""
    return f"""
<section class="cover">
  <div class="cover-mark">CI</div>
  <p class="cover-eyebrow">DOCUMENTACIÓN DEL APLICATIVO</p>
  <h1 class="cover-title">{TITULO}</h1>
  <p class="cover-sub">{SUBTITULO}</p>
  {extra}
  <div class="cover-meta">
    <div><span>Versión</span><strong>{VERSION.split()[-1]}</strong></div>
    <div><span>Fecha</span><strong>{FECHA_TXT}</strong></div>
    <div><span>Stack</span><strong>Angular 21 · FastAPI · PostgreSQL</strong></div>
  </div>
</section>"""


def indice(entradas: list[tuple[str, str, list[tuple[int, str, str]]]]) -> str:
    filas = []
    for clave, titulo, encabezados in entradas:
        filas.append(f'<li class="toc-doc"><a href="#{clave}">{html.escape(titulo)}</a><ul>')
        for nivel, ident, texto in encabezados:
            if nivel == 2:
                filas.append(f'<li><a href="#{ident}">{html.escape(texto)}</a></li>')
        filas.append("</ul></li>")
    return f'<section class="toc"><h1>Contenido</h1><ol>{"".join(filas)}</ol></section>'


def pagina(titulo: str, cuerpo: str) -> str:
    return f"""<!doctype html>
<html lang="es"><head><meta charset="utf-8"><title>{html.escape(titulo)}</title>
<style>{CSS}</style></head>
<body>{cuerpo}</body></html>"""


def _plantillas(titulo: str) -> tuple[str, str]:
    base = ("font-family:'Noto Sans Mono','DejaVu Sans Mono',monospace;font-size:7pt;color:#6b665e;"
            "width:100%;margin:0 16mm;display:flex;justify-content:space-between;")
    cabecera = (f'<div style="{base}padding-top:9mm"><span style="letter-spacing:.12em;font-weight:600">'
                f'COSTOS INDUSTRIAL</span><span>{html.escape(titulo)}</span></div>')
    pie = (f'<div style="{base}padding-bottom:7mm"><span>Documentación del aplicativo · {FECHA_TXT}</span>'
           '<span style="color:#1d1b18;font-weight:600"><span class="pageNumber"></span> / '
           '<span class="totalPages"></span></span></div>')
    return cabecera, pie


async def _imprimir_cdp(trabajos: list[tuple[Path, str, bool]], puerto: int) -> None:
    import asyncio
    import base64
    import json
    import urllib.request

    import websockets

    base = f"http://127.0.0.1:{puerto}"
    for _ in range(60):  # espera a que Chrome abra el puerto de depuración
        try:
            urllib.request.urlopen(f"{base}/json/version", timeout=1)
            break
        except OSError:
            await asyncio.sleep(0.5)
    else:
        raise RuntimeError("Chrome no respondió en el puerto de depuración")

    for html_file, titulo, con_encabezado in trabajos:
        req = urllib.request.Request(f"{base}/json/new?about:blank", method="PUT")
        target = json.load(urllib.request.urlopen(req))
        async with websockets.connect(target["webSocketDebuggerUrl"], max_size=None) as ws:
            seq = 0

            async def cdp(metodo: str, **params):  # noqa: ANN202
                nonlocal seq
                seq += 1
                mi_id = seq
                await ws.send(json.dumps({"id": mi_id, "method": metodo, "params": params}))
                while True:
                    msg = json.loads(await ws.recv())
                    if msg.get("id") == mi_id:
                        if "error" in msg:
                            raise RuntimeError(f"{metodo}: {msg['error']}")
                        return msg["result"]
                    if msg.get("method") == "Page.loadEventFired":
                        cargado.set()

            cargado = asyncio.Event()
            await cdp("Page.enable")
            await cdp("Page.navigate", url=f"file:///docs/exportar/build/{html_file.name}")
            while not cargado.is_set():
                msg = json.loads(await ws.recv())
                if msg.get("method") == "Page.loadEventFired":
                    cargado.set()
            await cdp("Runtime.evaluate", expression="document.fonts.ready.then(() => true)", awaitPromise=True)
            cabecera, pie = _plantillas(titulo)
            res = await cdp(
                "Page.printToPDF", printBackground=True, preferCSSPageSize=True,
                displayHeaderFooter=con_encabezado, headerTemplate=cabecera, footerTemplate=pie,
            )
            pdf = BUILD / (html_file.stem + ".pdf")
            pdf.write_bytes(base64.b64decode(res["data"]))
        urllib.request.urlopen(urllib.request.Request(f"{base}/json/close/{target['id']}", method="PUT"))


def imprimir(trabajos: list[tuple[Path, str, bool]]) -> None:
    """Levanta Chromium headless en Docker y le pide cada PDF por el protocolo DevTools."""
    import asyncio

    puerto = 9333
    contenedor = subprocess.run(
        [
            "docker", "run", "-d", "--rm", "--network", "host",
            "-v", f"{DOCS}:/docs:ro,z", "-v", f"{FONTS_DIR}:/usr/share/fonts:ro",
            IMAGE, "--no-sandbox", "--allow-file-access-from-files", "--hide-scrollbars",
            "--remote-debugging-address=127.0.0.1", f"--remote-debugging-port={puerto}", "about:blank",
        ],
        check=True, capture_output=True, text=True,
    ).stdout.strip()
    try:
        asyncio.run(_imprimir_cdp(trabajos, puerto))
    finally:
        subprocess.run(["docker", "kill", contenedor], capture_output=True)


def main() -> int:
    if shutil.which("docker") is None:
        print("Se necesita Docker para imprimir los PDF.", file=sys.stderr)
        return 1
    BUILD.mkdir(parents=True, exist_ok=True)
    OUT.mkdir(parents=True, exist_ok=True)

    # Cada PDF final = portada (sin encabezado/pie) + cuerpo (numerado), unidos con pdfunite.
    salidas: list[tuple[str, Path, Path]] = []
    trabajos: list[tuple[Path, str, bool]] = []

    def preparar(nombre: str, titulo_html: str, titulo_pag: str, portada_html: str, cuerpo: str) -> None:
        h_portada = BUILD / f"{nombre}.portada.html"
        h_cuerpo = BUILD / f"{nombre}.cuerpo.html"
        h_portada.write_text(pagina(titulo_html, portada_html), encoding="utf-8")
        h_cuerpo.write_text(pagina(titulo_html, cuerpo), encoding="utf-8")
        trabajos.extend([(h_portada, titulo_pag, False), (h_cuerpo, titulo_pag, True)])
        salidas.append((nombre, BUILD / f"{nombre}.portada.pdf", BUILD / f"{nombre}.cuerpo.pdf"))

    entradas, cuerpos = [], []
    for archivo, clave, titulo in DOCUMENTOS:
        cuerpo, encabezados = a_html(archivo, consolidado=False)
        preparar(archivo[:-3], f"{TITULO} — {titulo}", titulo, portada(titulo), cuerpo)
        cuerpos.append(a_html(archivo, consolidado=True)[0])
        entradas.append((clave, titulo, encabezados))
    preparar("Documentacion-Costos-Industrial", f"{TITULO} — Documentación", "Documentación completa",
             portada(), indice(entradas) + "".join(cuerpos))

    print(f"Imprimiendo {len(salidas)} PDF en {OUT.relative_to(DOCS.parent)}/ …")
    imprimir(trabajos)
    for nombre, p_portada, p_cuerpo in salidas:
        destino = OUT / f"{nombre}.pdf"
        subprocess.run(["pdfunite", str(p_portada), str(p_cuerpo), str(destino)], check=True)
        print(f"  ✓ {destino.name} ({destino.stat().st_size // 1024} KB)")
    return 0


if __name__ == "__main__":
    sys.exit(main())
