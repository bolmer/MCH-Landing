import json

with open(r'c:\Proyectos\nifi_backup\dashboard\public\data\lineage_nodes.json', 'r', encoding='utf-8') as f:
    data = json.load(f)
    keys = set()
    for node in data.get('nodes', []):
        if node.get('type') in ['databaseSource', 'databaseTarget', 'storedProcedure']:
            keys.update(node.get('data', {}).keys())
    print(f"Available keys in data object: {keys}")

    # Check for nodes that might have schema info but no dot in label
    sample_nodes = [n for n in data.get('nodes', []) if n.get('type') in ['databaseSource', 'databaseTarget', 'storedProcedure']][:50]
    for n in sample_nodes:
        print(f"ID: {n['id']}, Type: {n['type']}, Data: {n['data']}")
