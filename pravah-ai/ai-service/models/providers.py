import os
from typing import Dict, Any, List

AI_MODE = os.getenv("AI_MODE", "demo").lower()

class BaseAIProvider:
    """Base interface for PRAVAH-AI inference providers"""
    def is_demo(self) -> bool:
        return True

class DemoModelProvider(BaseAIProvider):
    """Deterministic, highly realistic demo provider matching PRD specifications"""
    def is_demo(self) -> bool:
        return True

class RealModelProvider(BaseAIProvider):
    """Production provider loading local weights/transformers when available"""
    def is_demo(self) -> bool:
        return False

def get_provider() -> BaseAIProvider:
    if AI_MODE == "real":
        try:
            return RealModelProvider()
        except Exception:
            return DemoModelProvider()
    return DemoModelProvider()
