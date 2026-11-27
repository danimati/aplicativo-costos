import os
import tempfile

import pytest

_tmp = tempfile.NamedTemporaryFile(suffix=".db", delete=False)
os.environ["DATABASE_URL"] = f"sqlite:///{_tmp.name}"

from fastapi.testclient import TestClient  # noqa: E402

from app.main import app  # noqa: E402
from app.seed import init_db  # noqa: E402


@pytest.fixture()
def client():
    init_db(reset=True)
    with TestClient(app) as c:
        yield c
