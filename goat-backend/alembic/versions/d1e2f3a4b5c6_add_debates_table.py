"""add debates table

Revision ID: d1e2f3a4b5c6
Revises: c7e8f9a0b1c2
Create Date: 2026-02-22 00:00:00.000000
"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = "d1e2f3a4b5c6"
down_revision: Union[str, Sequence[str], None] = "c7e8f9a0b1c2"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "debates",
        sa.Column("id", sa.Uuid(as_uuid=True), primary_key=True, nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column("deleted_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("title", sa.String(length=255), nullable=False),
        sa.Column("category_id", sa.Uuid(as_uuid=True), nullable=False),
        sa.Column("goat1_id", sa.Uuid(as_uuid=True), nullable=False),
        sa.Column("goat2_id", sa.Uuid(as_uuid=True), nullable=False),
        sa.Column("votes1", sa.Integer(), nullable=False, server_default="0"),
        sa.Column("votes2", sa.Integer(), nullable=False, server_default="0"),
        sa.Column("comments", sa.Integer(), nullable=False, server_default="0"),
        sa.Column("trending", sa.Boolean(), nullable=False, server_default=sa.text("false")),
        sa.Column("ai_summary", sa.Text(), nullable=True),
        sa.Column("strongest_pro", sa.Text(), nullable=True),
        sa.Column("strongest_con", sa.Text(), nullable=True),
        sa.ForeignKeyConstraint(["category_id"], ["categories.id"], ondelete="CASCADE"),
        sa.ForeignKeyConstraint(["goat1_id"], ["entities.id"], ondelete="CASCADE"),
        sa.ForeignKeyConstraint(["goat2_id"], ["entities.id"], ondelete="CASCADE"),
    )
    op.create_index("ix_debates_category_id", "debates", ["category_id"])
    op.create_index("ix_debates_goat1_id", "debates", ["goat1_id"])
    op.create_index("ix_debates_goat2_id", "debates", ["goat2_id"])
    op.create_index("ix_debates_trending", "debates", ["trending"])


def downgrade() -> None:
    op.drop_index("ix_debates_trending", table_name="debates")
    op.drop_index("ix_debates_goat2_id", table_name="debates")
    op.drop_index("ix_debates_goat1_id", table_name="debates")
    op.drop_index("ix_debates_category_id", table_name="debates")
    op.drop_table("debates")
