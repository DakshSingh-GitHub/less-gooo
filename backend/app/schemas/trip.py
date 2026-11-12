from __future__ import annotations

from datetime import datetime
from typing import Any, Dict, List, Literal, Optional

from pydantic import BaseModel, Field

TransitMode = Literal["flight", "train", "cab", "self_car"]
FuelType = Literal["petrol", "diesel", "ev"]
TripStatus = Literal["draft", "upcoming", "active", "completed"]


class SingleLegTransitCostSchema(BaseModel):
    mode: TransitMode
    direction: Literal["approaching", "departure"]
    directionLabel: str
    fromCity: str = Field(alias="from")
    to: str
    distanceKm: float
    fuelCost: Optional[float] = None
    fuelLiters: Optional[float] = None
    tollCost: Optional[float] = None
    ticketPricePerPerson: Optional[float] = None
    passengersCount: int
    totalCost: float
    summaryText: str

    model_config = {"populate_by_name": True}


class TransitCostBreakdownSchema(BaseModel):
    mode: TransitMode
    distanceKm: float
    roundTripDistanceKm: float
    fuelCost: Optional[float] = None
    tollCost: Optional[float] = None
    ticketPricePerPerson: Optional[float] = None
    passengersCount: int
    roundTripTotal: float
    summaryText: str


class NecessitiesSchema(BaseModel):
    hospital: bool = True
    medicalStore: bool = True
    atm: bool = True
    restrooms: bool = True


class PlanSpecificationsSchema(BaseModel):
    pace: Literal["relaxed", "moderate", "intensive"] = "moderate"
    includeRestaurants: bool = True
    dietaryPreference: Literal["pure_veg", "all"] = "pure_veg"
    cuisineTypes: List[str] = Field(default_factory=list)
    touristPreferences: List[str] = Field(default_factory=list)
    stayType: str = "Heritage Haveli / Courtyard Homestay"
    includeStayRest: bool = True
    approachingTransitMode: TransitMode = "self_car"
    departureTransitMode: TransitMode = "self_car"
    passengersCount: int = 1
    approachingCarFuelType: Optional[FuelType] = "petrol"
    departureCarFuelType: Optional[FuelType] = "petrol"
    transitMode: Optional[TransitMode] = None
    carFuelType: Optional[FuelType] = None
    necessities: NecessitiesSchema = Field(default_factory=NecessitiesSchema)


class ProposedPlanStopSchema(BaseModel):
    time: str
    title: str
    category: Literal["sightseeing", "food", "culture", "rest", "medical", "transit"]
    description: str
    location: Optional[str] = None
    isPureVeg: Optional[bool] = None
    transitNote: Optional[str] = None
    estimatedCost: Optional[str] = None


class ProposedPlanDaySchema(BaseModel):
    dayNumber: int
    date: str
    theme: str
    stops: List[ProposedPlanStopSchema]


class TripCreateRequest(BaseModel):
    title: str = Field(min_length=1, max_length=255)
    fromCity: Optional[str] = Field(default=None, alias="from")
    destination: str = Field(min_length=1, max_length=255)
    startDate: str
    endDate: str
    category: str = "Vacation"
    budget: float = 0.0
    currency: str = "INR"
    status: TripStatus = "upcoming"
    notes: Optional[str] = None
    specifications: Optional[Dict[str, Any]] = None

    model_config = {"populate_by_name": True}


class TripUpdateRequest(BaseModel):
    title: Optional[str] = None
    fromCity: Optional[str] = Field(default=None, alias="from")
    destination: Optional[str] = None
    startDate: Optional[str] = None
    endDate: Optional[str] = None
    category: Optional[str] = None
    budget: Optional[float] = None
    currency: Optional[str] = None
    status: Optional[TripStatus] = None
    notes: Optional[str] = None
    specifications: Optional[Dict[str, Any]] = None
    proposedPlan: Optional[List[Dict[str, Any]]] = None
    estimatedTicketCost: Optional[float] = None
    estimatedTransitCost: Optional[Dict[str, Any]] = None
    approachingTransitCost: Optional[Dict[str, Any]] = None
    departureTransitCost: Optional[Dict[str, Any]] = None

    model_config = {"populate_by_name": True}


class TripCompleteRequest(BaseModel):
    endDate: Optional[str] = None


class TripResponse(BaseModel):
    id: str
    userId: str
    title: str
    fromCity: Optional[str] = Field(default=None, serialization_alias="from")
    destination: str
    startDate: str
    endDate: str
    category: str
    budget: float
    currency: str
    status: TripStatus
    notes: Optional[str] = None
    specifications: Optional[Dict[str, Any]] = None
    proposedPlan: Optional[List[Dict[str, Any]]] = None
    estimatedTicketCost: Optional[float] = None
    estimatedTransitCost: Optional[Dict[str, Any]] = None
    approachingTransitCost: Optional[Dict[str, Any]] = None
    departureTransitCost: Optional[Dict[str, Any]] = None
    createdAt: datetime
    updatedAt: datetime


class GeneratePlanRequest(BaseModel):
    destination: str
    fromCity: str = Field(default="", alias="from")
    startDate: str
    endDate: str
    budget: float = 0.0
    currency: str = "INR"
    category: str = "Vacation"
    specifications: PlanSpecificationsSchema

    model_config = {"populate_by_name": True}


class ReplanRequest(BaseModel):
    dayNumber: int = 1
    currentStopIndex: int = 0
    delayMinutes: int = Field(ge=1, le=360)
