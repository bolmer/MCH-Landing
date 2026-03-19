import json

with open(r'c:\Proyectos\nifi_backup\dashboard\public\data\lineage_nodes.json', 'r', encoding='utf-8') as f:
    data = json.load(f)
    print(f"Total nodes: {len(data.get('nodes', []))}")
    db_nodes_with_schemas = [n for n in data.get('nodes', []) 
                             if n.get('type') in ['databaseSource', 'databaseTarget'] 
                             and '.' in n.get('data', {}).get('label', '')]
    print(f"Database nodes with schemas: {len(db_nodes_with_schemas)}")
    for n in db_nodes_with_schemas[:20]:
        print(f"Label: {n['data']['label']}")
