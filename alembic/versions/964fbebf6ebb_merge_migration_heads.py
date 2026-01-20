"""merge migration heads

Revision ID: 964fbebf6ebb
Revises: 41736819b7da, 808b5687741b
Create Date: 2026-01-20 13:43:22.482246

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '964fbebf6ebb'
down_revision: Union[str, Sequence[str], None] = ('41736819b7da', '808b5687741b')
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    pass


def downgrade() -> None:
    """Downgrade schema."""
    pass
