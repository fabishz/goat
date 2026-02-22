from typing import Any
import httpx
from app.core.logging import request_id_var


def _inject_request_id(headers: dict[str, str]) -> dict[str, str]:
    request_id = request_id_var.get()
    if request_id:
        headers.setdefault("X-Request-ID", request_id)
    return headers


def get_httpx_client(**kwargs: Any) -> httpx.Client:
    headers = dict(kwargs.pop("headers", {}) or {})
    headers = _inject_request_id(headers)
    return httpx.Client(headers=headers, **kwargs)


def get_async_httpx_client(**kwargs: Any) -> httpx.AsyncClient:
    headers = dict(kwargs.pop("headers", {}) or {})
    headers = _inject_request_id(headers)
    return httpx.AsyncClient(headers=headers, **kwargs)
