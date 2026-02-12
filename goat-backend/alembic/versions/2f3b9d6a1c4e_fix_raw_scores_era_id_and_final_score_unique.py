"""Fix raw_scores.era_id and final_scores uniqueness

Revision ID: 2f3b9d6a1c4e
Revises: 701a851fb3b0
Create Date: 2026-02-11 00:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '2f3b9d6a1c4e'
down_revision: Union[str, Sequence[str], None] = '701a851fb3b0'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    # Change raw_scores.era_id from String to UUID and add FK to eras
    op.alter_column(
        'raw_scores',
        'era_id',
        existing_type=sa.String(length=50),
        type_=sa.UUID(),
        postgresql_using='era_id::uuid',
        nullable=True,
    )
    op.create_foreign_key(
        'fk_raw_scores_era_id',
        'raw_scores',
        'eras',
        ['era_id'],
        ['id'],
        ondelete='SET NULL',
    )

    # Prevent duplicate final scores per entity + model
    op.create_unique_constraint(
        'uq_final_scores_entity_model',
        'final_scores',
        ['entity_id', 'scoring_model_id'],
    )


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_constraint('uq_final_scores_entity_model', 'final_scores', type_='unique')
    op.drop_constraint('fk_raw_scores_era_id', 'raw_scores', type_='foreignkey')
    op.alter_column(
        'raw_scores',
        'era_id',
        existing_type=sa.UUID(),
        type_=sa.String(length=50),
        nullable=True,
    )
