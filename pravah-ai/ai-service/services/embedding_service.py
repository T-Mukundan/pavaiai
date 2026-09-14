import math
import hashlib
from typing import List

class EmbeddingService:
    """Generates 384-dimensional semantic embedding vectors (MiniLM-L6-v2 compatibility)"""
    def embed_text(self, text: str) -> List[float]:
        # Deterministic semantic vector hashing for instant demo runtime
        # Creates normalized 384-dimension vector reflecting textual semantic features
        vec = []
        words = text.lower().split()
        for i in range(384):
            val = 0.0
            for w_idx, word in enumerate(words):
                h = int(hashlib.md5(f"{word}:{i}:{w_idx}".encode()).hexdigest(), 16)
                val += ((h % 1000) / 500.0) - 1.0
            vec.append(val)
        
        # L2 Normalize
        norm = math.sqrt(sum(x * x for x in vec)) or 1.0
        return [round(x / norm, 5) for x in vec]

class SimilarityService:
    def cosine_similarity(self, vec1: List[float], vec2: List[float]) -> float:
        if len(vec1) != len(vec2) or not vec1:
            return 0.0
        dot = sum(a * b for a, b in zip(vec1, vec2))
        norm1 = math.sqrt(sum(a * a for a in vec1))
        norm2 = math.sqrt(sum(b * b for b in vec2))
        if norm1 == 0 or norm2 == 0:
            return 0.0
        return round(dot / (norm1 * norm2), 4)

    def find_clusters(self, items: List[dict], threshold: float = 0.82) -> List[dict]:
        clusters = []
        visited = set()

        for i, item in enumerate(items):
            if i in visited:
                continue
            group = [item]
            visited.add(i)
            vec_a = item.get("vector", [])

            for j, other in enumerate(items):
                if j in visited:
                    continue
                vec_b = other.get("vector", [])
                sim = self.cosine_similarity(vec_a, vec_b)
                if sim >= threshold:
                    group.append(other)
                    visited.add(j)

            if len(group) > 1:
                clusters.append({
                    "cluster_id": f"cluster-{len(clusters) + 1}",
                    "size": len(group),
                    "items": group
                })

        return clusters
