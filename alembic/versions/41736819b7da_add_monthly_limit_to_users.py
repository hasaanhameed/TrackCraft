"""add monthly_limit to users

Revision ID: 41736819b7da
Revises: c25f4bd94944
Create Date: 2026-01-20 13:40:01.113242

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '41736819b7da'
down_revision: Union[str, None] = 'c25f4bd94944'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Add monthly_limit column to users table
    op.add_column('users', sa.Column('monthly_limit', sa.Float(), nullable=True))


def downgrade() -> None:
    # Remove monthly_limit column from users table
    op.drop_column('users', 'monthly_limit')