import json

with open(r'c:\Proyectos\nifi_backup\dashboard\public\data\lineage_nodes.json', 'r', encoding='utf-8') as f:
    data = json.load(f)
    for node in data.get('nodes', []):
        if node.get('type') != 's3Object':
            label = node.get('data', {}).get('label', '')
            if '.' in label:
                print(f"Type: {node['type']}, Label: {label}")
