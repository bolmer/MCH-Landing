import json

with open(r'c:\Proyectos\nifi_backup\dashboard\public\data\lineage_nodes.json', 'r', encoding='utf-8') as f:
    data = json.load(f)
    # Get 5 nodes of each type
    types = ['nifiGroup', 'databaseSource', 'databaseTarget', 'storedProcedure', 's3Object']
    for t in types:
        print(f"--- TYPE: {t} ---")
        nodes = [n for n in data.get('nodes', []) if n.get('type') == t]
        for n in nodes[:5]:
            print(json.dumps(n, indent=2))
