"""
Create hypertables and a sample continuous aggregate

Revision ID: 0002_timescale_hypertables
Revises: 0001_enable_extensions
Create Date: 2025-09-23
"""

from alembic import op

revision = "0002_timescale_hypertables"
down_revision = "0001_enable_extensions"
branch_labels = None
depends_on = None


def upgrade() -> None:
	# Example: oceanography_records with time index
	op.execute(
		"""
		SELECT create_hypertable('oceanography_records', 'timestamp', if_not_exists => TRUE);
		"""
	)
	# Example continuous aggregate: daily mean by parameter
	op.execute(
		"""
		CREATE MATERIALIZED VIEW IF NOT EXISTS cagg_oceanography_daily
		WITH (timescaledb.continuous) AS
		SELECT time_bucket('1 day', timestamp) AS day,
		       parameter,
		       avg(value) AS mean_value
		FROM oceanography_records
		GROUP BY day, parameter;
		"""
	)


def downgrade() -> None:
	op.execute("DROP MATERIALIZED VIEW IF EXISTS cagg_oceanography_daily;")


