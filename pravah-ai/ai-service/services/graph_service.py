from typing import List, Dict, Any, Tuple
import networkx as nx

class GraphService:
    """
    Detects procedural ping-pong and circular jurisdictional routing
    using NetworkX and Tarjan's Strongly Connected Components (SCC) algorithm.
    """
    def analyze_routing(self, transfers: List[Dict[str, str]]) -> Dict[str, Any]:
        """
        transfers: list of dicts with 'from_department' and 'to_department'
        """
        if not transfers:
            return {
                "deadlock_detected": False,
                "cycles": [],
                "cycle_paths": [],
                "departments_involved": [],
                "total_transfers": 0,
                "message": "No transfer activity recorded."
            }

        G = nx.DiGraph()

        for t in transfers:
            u = t.get("from_department", "").strip()
            v = t.get("to_department", "").strip()
            if u and v:
                if G.has_edge(u, v):
                    G[u][v]["weight"] += 1
                else:
                    G.add_edge(u, v, weight=1)

        # Apply Tarjan's Strongly Connected Components (SCC) algorithm
        sccs = list(nx.strongly_connected_components(G))
        
        deadlock_cycles = []
        cycle_paths = []
        departments_involved = set()

        for comp in sccs:
            # An SCC with >1 node indicates circular routing / mutual cycle
            if len(comp) > 1:
                comp_list = list(comp)
                deadlock_cycles.append(comp_list)
                departments_involved.update(comp_list)
                
                # Extract representative cyclic path through subgraph
                sub = G.subgraph(comp)
                try:
                    simple_cycles = list(nx.simple_cycles(sub))
                    if simple_cycles:
                        for cyc in simple_cycles[:3]:
                            cycle_paths.append(cyc + [cyc[0]])
                except Exception:
                    cycle_paths.append(comp_list + [comp_list[0]])
            elif len(comp) == 1:
                # Self-loop check
                node = list(comp)[0]
                if G.has_edge(node, node):
                    deadlock_cycles.append([node])
                    cycle_paths.append([node, node])
                    departments_involved.add(node)

        is_deadlocked = len(deadlock_cycles) > 0

        return {
            "deadlock_detected": is_deadlocked,
            "algorithm": "Tarjan's Strongly Connected Components (SCC)",
            "cycles": deadlock_cycles,
            "cycle_paths": cycle_paths,
            "departments_involved": list(departments_involved),
            "total_transfers": len(transfers),
            "graph_nodes": list(G.nodes()),
            "graph_edges": [{"source": u, "target": v, "weight": d["weight"]} for u, v, d in G.edges(data=True)],
            "severity": "HIGH" if len(transfers) >= 3 and is_deadlocked else ("MEDIUM" if is_deadlocked else "NONE"),
            "diagnosis": "Potential Jurisdictional Deadlock: Cyclical bureaucratic transfer identified" if is_deadlocked else "Linear or non-cyclic transfer routing."
        }
