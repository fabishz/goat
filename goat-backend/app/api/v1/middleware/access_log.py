import time
import logging
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
from starlette.responses import Response

logger = logging.getLogger("access")


class AccessLogMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        start = time.perf_counter()
        response: Response
        try:
            response = await call_next(request)
            return response
        finally:
            duration_ms = int((time.perf_counter() - start) * 1000)
            client_ip = request.client.host if request.client else ""
            user_id = getattr(request.state, "user_id", "")
            content_length = ""
            if response is not None:
                content_length = response.headers.get("content-length", "")
            if duration_ms < 50:
                bucket = "lt_50ms"
            elif duration_ms < 100:
                bucket = "lt_100ms"
            elif duration_ms < 250:
                bucket = "lt_250ms"
            elif duration_ms < 500:
                bucket = "lt_500ms"
            elif duration_ms < 1000:
                bucket = "lt_1000ms"
            else:
                bucket = "gte_1000ms"
            request_id = getattr(request.state, "request_id", "")
            logger.info(
                "event=http.request method=%s path=%s status=%s duration_ms=%s bucket=%s ip=%s user_id=%s bytes=%s request_id=%s",
                request.method,
                request.url.path,
                getattr(response, "status_code", 500),
                duration_ms,
                bucket,
                client_ip,
                user_id,
                content_length,
                request_id,
            )
