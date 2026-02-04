import logging
import sys
from contextvars import ContextVar
import uuid

# Global context for request ID
request_id_var: ContextVar[str] = ContextVar("request_id", default="")

class RequestIdFilter(logging.Filter):
    def filter(self, record):
        record.request_id = request_id_var.get()
        return True

def setup_logging():
    log_format = "%(asctime)s - %(name)s - %(levelname)s - [%(request_id)s] - %(message)s"
    
    handler = logging.StreamHandler(sys.stdout)
    handler.setFormatter(logging.Formatter(log_format))
    handler.addFilter(RequestIdFilter())
    
    logging.basicConfig(
        level=logging.INFO,
        handlers=[handler],
        force=True
    )
    
    # Suppress some noisy loggers
    logging.getLogger("uvicorn.access").setLevel(logging.WARNING)
