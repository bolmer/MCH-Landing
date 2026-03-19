import json

with open(r'c:\Proyectos\nifi_backup\dashboard\public\data\lineage_nodes.json', 'r', encoding='utf-8') as f:
    data = json.load(f)
    sp_nodes = [node for node in data.get('nodes', []) if node.get('type') == 'storedProcedure']
    for node in sp_nodes[:10]:
        print(node.get('data', {}).get('label'))
