"""
Enable PostGIS and TimescaleDB extensions

Revision ID: 0001_enable_extensions
Revises: 
Create Date: 2025-09-23
"""

from alembic import op

# revision identifiers, used by Alembic.
revision = "0001_enable_extensions"
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
	op.execute("CREATE EXTENSION IF NOT EXISTS postgis;")
	op.execute("CREATE EXTENSION IF NOT EXISTS timescaledb;")


def downgrade() -> None:
	# Do not drop extensions automatically to avoid impacting other schemas
	pass


