import json

with open(r'c:\Proyectos\nifi_backup\dashboard\public\data\lineage_nodes.json', 'r', encoding='utf-8') as f:
    data = json.load(f)
    nodes = data.get('nodes', [])
    edges = data.get('edges', [])
    
    db_node_ids = {n['id'] for n in nodes if n['type'] in ['databaseSource', 'databaseTarget']}
    connected_edges = [e for e in edges if e['source'] in db_node_ids or e['target'] in db_node_ids]
    
    print(f"Total database nodes: {len(db_node_ids)}")
    print(f"Edges connected to database nodes: {len(connected_edges)}")
    
    if connected_edges:
        print("Sample edges:")
        for e in connected_edges[:5]:
            print(f"  {e['source']} -> {e['target']}")
