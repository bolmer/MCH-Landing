import json

with open(r'c:\Proyectos\nifi_backup\dashboard\public\data\lineage_nodes.json', 'r', encoding='utf-8') as f:
    data = json.load(f)
    db_nodes_with_dots = [node for node in data.get('nodes', []) 
                          if node.get('type') in ['databaseSource', 'databaseTarget'] 
                          and '.' in node.get('data', {}).get('label', '')]
    for node in db_nodes_with_dots:
        print(f"Type: {node['type']}, Label: {node['data']['label']}")
