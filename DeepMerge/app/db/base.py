from app.db.session import Base  # noqa: F401

# Import all models so Alembic can autogenerate migrations
from app.models.oceanography import OceanographyRecord  # noqa: F401
from app.models.fisheries import FisheriesRecord  # noqa: F401
from app.models.biodiversity import BiodiversityRecord  # noqa: F401
from app.models.molecular import MolecularRecord  # noqa: F401
