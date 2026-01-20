"""add monthly_limit to users

Revision ID: 808b5687741b
Revises: c25f4bd94944
Create Date: 2026-01-20 13:37:52.170395

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '808b5687741b'
down_revision: Union[str, Sequence[str], None] = 'c25f4bd94944'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade():
    op.add_column('users', sa.Column('monthly_limit', sa.Float(), nullable=True))

def downgrade():
    op.drop_column('users', 'monthly_limit')
