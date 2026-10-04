import networkx as nx
import json
from database import get_all_cases

def build_graph(entities: dict = None, current_case_id: str = None):
    """
    Build the Scam DNA graph connecting the current input
    with all seeded cases via shared entities.
    Returns nodes and links in React Force Graph format.
    """
    G = nx.Graph()
    cases = get_all_cases()

    matched_case_ids = set()

    # --- Add all seeded case nodes ---
    for case in cases:
        G.add_node(
            f"case_{case['id']}",
            label=case["name"],
            type="case",
            risk=case["risk"],
            description=case["description"],
            reported_count=case["reported_count"],
        )

    # --- Add entity nodes for seeded cases ---
    for case in cases:
        cnode = f"case_{case['id']}"
        for upi in case["upi_ids"]:
            nid = f"upi_{upi}"
            G.add_node(nid, label=upi, type="upi", risk="high")
            G.add_edge(cnode, nid, relation="uses_upi")
        for phone in case["phones"]:
            nid = f"phone_{phone}"
            G.add_node(nid, label=phone, type="phone", risk="medium")
            G.add_edge(cnode, nid, relation="uses_phone")
        for domain in case["domains"]:
            nid = f"domain_{domain}"
            G.add_node(nid, label=domain, type="domain", risk="high")
            G.add_edge(cnode, nid, relation="uses_domain")
        for handle in case["social_handles"]:
            nid = f"social_{handle}"
            G.add_node(nid, label=handle, type="social", risk="medium")
            G.add_edge(cnode, nid, relation="uses_social")

    related_cases = []

    # --- If we have user-submitted entities, connect them ---
    if entities:
        if current_case_id:
            G.add_node(
                f"case_{current_case_id}",
                label="Your Submission",
                type="current_case",
                risk="analyzing",
                description="Currently analyzed message",
                reported_count=0,
            )

        user_entities = []

        for upi in entities.get("upi_ids", []):
            nid = f"upi_{upi}"
            if not G.has_node(nid):
                G.add_node(nid, label=upi, type="upi", risk="unknown")
            if current_case_id:
                G.add_edge(f"case_{current_case_id}", nid, relation="contains_upi")
            user_entities.append(nid)

        for phone in entities.get("phone_numbers", []):
            nid = f"phone_{phone}"
            if not G.has_node(nid):
                G.add_node(nid, label=phone, type="phone", risk="unknown")
            if current_case_id:
                G.add_edge(f"case_{current_case_id}", nid, relation="contains_phone")
            user_entities.append(nid)

        for url in entities.get("urls", []):
            domain = url.replace("https://", "").replace("http://", "").split("/")[0]
            nid = f"domain_{domain}"
            if not G.has_node(nid):
                G.add_node(nid, label=domain, type="domain", risk="unknown")
            if current_case_id:
                G.add_edge(f"case_{current_case_id}", nid, relation="contains_domain")
            user_entities.append(nid)

        for handle in entities.get("social_handles", []):
            nid = f"social_{handle}"
            if not G.has_node(nid):
                G.add_node(nid, label=handle, type="social", risk="unknown")
            if current_case_id:
                G.add_edge(f"case_{current_case_id}", nid, relation="contains_social")
            user_entities.append(nid)

        # --- Find related seeded cases through shared entities ---
        for ent_node in user_entities:
            if G.has_node(ent_node):
                neighbors = list(G.neighbors(ent_node))
                for neighbor in neighbors:
                    if neighbor.startswith("case_") and not neighbor.endswith(str(current_case_id)):
                        case_id_raw = neighbor.replace("case_", "")
                        try:
                            matched_case = next(c for c in cases if str(c["id"]) == case_id_raw)
                            if matched_case["id"] not in matched_case_ids:
                                matched_case_ids.add(matched_case["id"])
                                related_cases.append({
                                    "id": matched_case["id"],
                                    "name": matched_case["name"],
                                    "description": matched_case["description"],
                                    "risk": matched_case["risk"],
                                    "reported_count": matched_case["reported_count"],
                                    "shared_entity": G.nodes[ent_node]["label"],
                                    "shared_entity_type": G.nodes[ent_node]["type"],
                                })
                        except StopIteration:
                            pass

    # --- Serialize to React Force Graph format ---
    nodes = []
    links = []

    for node_id, attrs in G.nodes(data=True):
        nodes.append({
            "id": node_id,
            "label": attrs.get("label", node_id),
            "type": attrs.get("type", "unknown"),
            "risk": attrs.get("risk", "unknown"),
            "description": attrs.get("description", ""),
            "reported_count": attrs.get("reported_count", 0),
        })

    for u, v, attrs in G.edges(data=True):
        links.append({
            "source": u,
            "target": v,
            "relation": attrs.get("relation", "connected"),
        })

    return {
        "nodes": nodes,
        "links": links,
        "related_cases": related_cases,
        "total_cases": len(cases),
        "matched_cases": len(matched_case_ids),
    }


def get_entity_subgraph(entity_id: str):
    """Get a focused subgraph around a specific entity node."""
    full = build_graph()
    G = nx.Graph()
    for node in full["nodes"]:
        G.add_node(node["id"], **node)
    for link in full["links"]:
        G.add_edge(link["source"], link["target"], relation=link["relation"])

    if entity_id not in G:
        return {"nodes": [], "links": [], "related_cases": []}

    # Get 2-hop neighborhood
    neighbors_1 = set(G.neighbors(entity_id))
    neighbors_2 = set()
    for n in neighbors_1:
        neighbors_2.update(G.neighbors(n))
    subgraph_nodes = {entity_id} | neighbors_1 | neighbors_2
    subG = G.subgraph(subgraph_nodes)

    nodes = [{"id": n, **G.nodes[n]} for n in subG.nodes]
    links = [{"source": u, "target": v, **d} for u, v, d in subG.edges(data=True)]
    return {"nodes": nodes, "links": links}
