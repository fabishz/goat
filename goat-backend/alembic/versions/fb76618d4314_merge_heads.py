"""merge heads

Revision ID: fb76618d4314
Revises: 5e6f7g8h9i0j, d1e2f3a4b5c6
Create Date: 2026-02-22 14:23:50.993205

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'fb76618d4314'
down_revision: Union[str, Sequence[str], None] = ('5e6f7g8h9i0j', 'd1e2f3a4b5c6')
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    pass


def downgrade() -> None:
    """Downgrade schema."""
    pass
