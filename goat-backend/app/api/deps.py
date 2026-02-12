"""Compatibility imports for legacy modules.

Prefer importing from ``app.api.v1.deps`` directly.
"""

from app.api.v1.deps import (  # noqa: F401
    RoleChecker,
    get_current_active_superuser,
    get_current_active_user,
    get_current_expert,
    get_current_user,
    reusable_oauth2,
)
