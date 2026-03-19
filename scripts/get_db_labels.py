import json

with open(r'c:\Proyectos\nifi_backup\dashboard\public\data\lineage_nodes.json', 'r', encoding='utf-8') as f:
    data = json.load(f)
    db_nodes = [node for node in data.get('nodes', []) if node.get('type') in ['databaseSource', 'databaseTarget']]
    for node in db_nodes[:20]:
        print(node.get('data', {}).get('label'))
