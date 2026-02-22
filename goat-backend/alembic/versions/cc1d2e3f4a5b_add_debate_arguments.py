"""add debate arguments

Revision ID: cc1d2e3f4a5b
Revises: fb76618d4314
Create Date: 2026-02-22 00:00:00.000000
"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = "cc1d2e3f4a5b"
down_revision: Union[str, Sequence[str], None] = "fb76618d4314"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "debate_arguments",
        sa.Column("id", sa.Uuid(as_uuid=True), primary_key=True, nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column("deleted_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("debate_id", sa.Uuid(as_uuid=True), nullable=False),
        sa.Column("user_id", sa.Uuid(as_uuid=True), nullable=True),
        sa.Column("user_name", sa.String(length=255), nullable=False),
        sa.Column("user_avatar", sa.String(length=512), nullable=True),
        sa.Column("content", sa.Text(), nullable=False),
        sa.Column("type", sa.String(length=8), nullable=False),
        sa.Column("upvotes", sa.Integer(), nullable=False, server_default="0"),
        sa.Column("downvotes", sa.Integer(), nullable=False, server_default="0"),
        sa.ForeignKeyConstraint(["debate_id"], ["debates.id"], ondelete="CASCADE"),
        sa.ForeignKeyConstraint(["user_id"], ["users.id"], ondelete="SET NULL"),
    )
    op.create_index("ix_debate_arguments_debate_id", "debate_arguments", ["debate_id"])
    op.create_index("ix_debate_arguments_user_id", "debate_arguments", ["user_id"])


def downgrade() -> None:
    op.drop_index("ix_debate_arguments_user_id", table_name="debate_arguments")
    op.drop_index("ix_debate_arguments_debate_id", table_name="debate_arguments")
    op.drop_table("debate_arguments")
