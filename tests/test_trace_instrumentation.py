import pytest
from fastapi.testclient import TestClient
from backend.main import app

client = TestClient(app)

def test_correlation_id_header():
    custom_id = "test-corr-trace-12345"
    response = client.get("/pantry", headers={"X-Correlation-Id": custom_id})
    assert response.status_code == 200
    assert response.headers.get("X-Correlation-Id") == custom_id

def test_optimize_trace_meta_instrumentation():
    payload = {
        "algorithm": "parallel",
        "num_threads": 2,
        "dataset_tier": "small",
        "population_size": 20,
        "generations": 10,
        "random_seed": 99,
        "correlation_id": "test-opt-corr-999"
    }
    response = client.post("/optimize", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "trace_meta" in data
    trace = data["trace_meta"]
    assert trace["correlation_id"] == "test-opt-corr-999"
    assert "stages" in trace
    assert len(trace["stages"]) >= 5
    assert trace["temp_files_cleaned"] is True
    assert "c_execution_time_ms" in trace

