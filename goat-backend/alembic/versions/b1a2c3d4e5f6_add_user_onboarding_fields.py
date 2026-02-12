"""Add user onboarding fields

Revision ID: b1a2c3d4e5f6
Revises: 2f3b9d6a1c4e
Create Date: 2026-02-12 00:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = "b1a2c3d4e5f6"
down_revision: Union[str, Sequence[str], None] = "2f3b9d6a1c4e"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.add_column(
        "users",
        sa.Column(
            "onboarding_status",
            sa.String(length=32),
            server_default="not_started",
            nullable=False,
        ),
    )
    op.add_column(
        "users",
        sa.Column(
            "onboarding_step",
            sa.Integer(),
            server_default=sa.text("0"),
            nullable=False,
        ),
    )


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_column("users", "onboarding_step")
    op.drop_column("users", "onboarding_status")
