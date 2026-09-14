from typing import Dict, Any

DEPARTMENT_TAXONOMY = {
    "ROADS_HWY": {
        "name": "Roads & Highways",
        "category": "Road Infrastructure",
        "keywords": ["pothole", "road", "asphalt", "crater", "pavement", "highway", "divider", "speed breaker", "footpath", "tar"],
    },
    "DRAINAGE": {
        "name": "Drainage & Stormwater",
        "category": "Drainage & Stormwater",
        "keywords": ["drain", "waterlogging", "stormwater", "culvert", "clogged", "overflow", "gutter", "monsoon", "sewage", "manhole"],
    },
    "WATER_SUPPLY": {
        "name": "Water Supply & Sewerage",
        "category": "Water Quality",
        "keywords": ["water", "tap", "pipeline", "leakage", "pressure", "turbid", "dirty water", "drinking water", "supply", "borewell"],
    },
    "ELECTRICITY": {
        "name": "Electricity Distribution",
        "category": "Power Infrastructure",
        "keywords": ["electricity", "power", "transformer", "spark", "blackout", "voltage", "cable", "wire", "pole", "meter"],
    },
    "SOLID_WASTE": {
        "name": "Solid Waste Management",
        "category": "Solid Waste Management",
        "keywords": ["garbage", "waste", "trash", "dump", "debris", "litter", "dustbin", "collection", "stench", "rot"],
    },
    "STREET_LIGHT": {
        "name": "Street Lighting",
        "category": "Illumination & Street Lighting",
        "keywords": ["streetlight", "lamp", "dark", "illumination", "light post", "bulb", "flickering"],
    },
    "HEALTH_MED": {
        "name": "Health & Medical Services",
        "category": "Public Healthcare Facilities",
        "keywords": ["hospital", "doctor", "medicine", "clinic", "health", "nurse", "oxygen", "bed", "patient", "ambulance"],
    },
    "REVENUE_LAND": {
        "name": "Revenue & Land Administration",
        "category": "Land Records & Titling",
        "keywords": ["land", "property", "mutation", "khata", "patta", "survey", "registry", "encroachment", "title"],
    },
    "TRAFFIC_MGMT": {
        "name": "Traffic Management",
        "category": "Traffic Control",
        "keywords": ["traffic", "signal", "jam", "congestion", "parking", "junction", "zebra", "police"],
    },
    "MUNICIPAL_ADMIN": {
        "name": "Municipal Administration",
        "category": "Municipal Administration",
        "keywords": ["trade license", "tax", "corporation", "bylaw", "zoning", "permit", "commercial"],
    }
}

class ClassificationService:
    def classify(self, text: str) -> Dict[str, Any]:
        text_lower = text.lower()
        best_dept = "CIVIC_INFRA"
        best_name = "Civic Infrastructure"
        best_cat = "General Infrastructure"
        highest_score = 0

        for dept_code, data in DEPARTMENT_TAXONOMY.items():
            matches = sum(1 for kw in data["keywords"] if kw in text_lower)
            if matches > highest_score:
                highest_score = matches
                best_dept = dept_code
                best_name = data["name"]
                best_cat = data["category"]

        confidence = min(0.96, max(0.68, 0.65 + (highest_score * 0.08)))

        return {
            "department_code": best_dept,
            "department_name": best_name,
            "category": best_cat,
            "confidence": round(confidence, 2),
            "suggested_sla_hours": 48 if best_dept in ["ROADS_HWY", "DRAINAGE", "ELECTRICITY"] else 72,
            "model": "pravah-nlp-classifier-v1"
        }
