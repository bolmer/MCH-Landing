import json

with open(r'c:\Proyectos\nifi_backup\dashboard\public\data\lineage_nodes.json', 'r', encoding='utf-8') as f:
    data = json.load(f)
    for node in data.get('nodes', []):
        label = node.get('data', {}).get('label', '')
        if '.' in label:
            print(f"Type: {node.get('type')}, Label: {label}")
