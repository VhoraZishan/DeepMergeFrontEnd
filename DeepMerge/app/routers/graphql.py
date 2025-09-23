from fastapi import APIRouter
from starlette_graphene3 import GraphQLApp
from graphene import ObjectType, String, List, Float, Int, Field, Schema
from graphene.types.datetime import DateTime
from app.ingestion.incois import IncoisClient, IncoisRecord
from app.ingestion.cmfri import CmfriClient, CmfriLandingRecord
from app.ingestion.ibp import IBPClient, IBPRecord
from app.ingestion.ncbi import NCBIClient, NCBIRecord
from typing import Optional

router = APIRouter(prefix="/graphql", tags=["graphql"])


class OceanographyType(ObjectType):
	parameter = String()
	latitude = Float()
	longitude = Float()
	value = Float()
	timestamp = String()
	region = String()
	source = String()


class FisheriesType(ObjectType):
	species = String()
	landing_center = String()
	state = String()
	quantity_tonnes = Float()
	gear_type = String()
	landing_date = String()
	source = String()


class BiodiversityType(ObjectType):
	species_name = String()
	common_name = String()
	latitude = Float()
	longitude = Float()
	observation_date = String()
	habitat = String()
	conservation_status = String()
	region = String()
	source = String()


class MolecularType(ObjectType):
	accession = String()
	title = String()
	organism = String()
	location = String()
	collection_date = String()
	sequencing_platform = String()
	read_count = Int()
	source = String()


class Query(ObjectType):
	# Oceanography queries
	oceanography_records = List(
		OceanographyType,
		parameter=String(),
		region=String(),
		limit=Int()
	)
	
	# Fisheries queries
	fisheries_records = List(
		FisheriesType,
		state=String(),
		species=String(),
		limit=Int()
	)
	
	# Biodiversity queries
	biodiversity_species = List(
		BiodiversityType,
		query=String(),
		region=String(),
		limit=Int()
	)
	
	# Molecular queries
	molecular_edna = List(
		MolecularType,
		location=String(),
		limit=Int()
	)
	
	# Health check
	health = String()

	async def resolve_health(self, info):
		return "GraphQL API is healthy"

	async def resolve_oceanography_records(self, info, parameter: Optional[str] = None, region: Optional[str] = None, limit: int = 10):
		client = IncoisClient()
		try:
			if parameter == "sst":
				records = await client.fetch_sst_daily(region or "kerala")
			elif parameter == "tide_height":
				records = await client.fetch_tide_data("kochi")
			else:
				records = await client.fetch_sst_daily(region or "kerala")
			
			return [OceanographyType(
				parameter=r.parameter,
				latitude=r.lat,
				longitude=r.lon,
				value=r.value,
				timestamp=r.timestamp,
				region=region,
				source="INCOIS"
			) for r in records[:limit]]
		except:
			return []

	async def resolve_fisheries_records(self, info, state: Optional[str] = None, species: Optional[str] = None, limit: int = 10):
		client = CmfriClient()
		try:
			records = await client.fetch_landings(state or "Kerala")
			if species:
				records = [r for r in records if species.lower() in r.species.lower()]
			return [FisheriesType(
				species=r.species,
				landing_center=r.landing_center,
				state=r.state,
				quantity_tonnes=r.quantity_tonnes,
				gear_type=r.gear_type,
				landing_date=r.date,
				source="CMFRI"
			) for r in records[:limit]]
		except:
			return []

	async def resolve_biodiversity_species(self, info, query: Optional[str] = None, region: Optional[str] = None, limit: int = 10):
		client = IBPClient()
		try:
			if query:
				records = await client.search_species(query, limit)
			else:
				records = await client.get_marine_observations(region or "kerala")
			return [BiodiversityType(
				species_name=r.species_name,
				common_name=r.common_name,
				latitude=r.latitude,
				longitude=r.longitude,
				observation_date=r.observation_date,
				habitat=r.habitat,
				conservation_status=r.conservation_status,
				region=region,
				source="IBP"
			) for r in records[:limit]]
		except:
			return []

	async def resolve_molecular_edna(self, info, location: Optional[str] = None, limit: int = 10):
		client = NCBIClient()
		try:
			records = await client.search_marine_edna(location or "India", limit)
			return [MolecularType(
				accession=r.accession,
				title=r.title,
				organism=r.organism,
				location=r.location,
				collection_date=r.collection_date,
				sequencing_platform=r.sequencing_platform,
				read_count=r.read_count,
				source="NCBI"
			) for r in records[:limit]]
		except:
			return []


# Create GraphQL schema
schema = Schema(query=Query)

# Add GraphQL endpoint (trailing slash)
router.add_route("/", GraphQLApp(schema=schema), methods=["GET", "POST"])
