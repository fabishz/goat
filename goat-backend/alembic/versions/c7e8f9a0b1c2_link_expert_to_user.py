"""Link expert to user

Revision ID: c7e8f9a0b1c2
Revises: b1a2c3d4e5f6
Create Date: 2026-02-12 00:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = "c7e8f9a0b1c2"
down_revision: Union[str, Sequence[str], None] = "b1a2c3d4e5f6"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.add_column("experts", sa.Column("user_id", sa.Uuid(), nullable=True))
    op.create_foreign_key(
        "fk_experts_user_id_users",
        "experts",
        "users",
        ["user_id"],
        ["id"],
        ondelete="SET NULL",
    )
    op.create_unique_constraint("uq_experts_user_id", "experts", ["user_id"])


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_constraint("uq_experts_user_id", "experts", type_="unique")
    op.drop_constraint("fk_experts_user_id_users", "experts", type_="foreignkey")
    op.drop_column("experts", "user_id")
