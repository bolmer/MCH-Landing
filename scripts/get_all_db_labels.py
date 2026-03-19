import json

with open(r'c:\Proyectos\nifi_backup\dashboard\public\data\lineage_nodes.json', 'r', encoding='utf-8') as f:
    data = json.load(f)
    db_labels = [n.get('data', {}).get('label', '') for n in data.get('nodes', []) if n.get('type') in ['databaseSource', 'databaseTarget']]
    for label in sorted(list(set(db_labels))):
        print(label)
