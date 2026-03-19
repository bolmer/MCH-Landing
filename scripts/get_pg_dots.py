import json

with open(r'c:\Proyectos\nifi_backup\dashboard\public\data\lineage_nodes.json', 'r', encoding='utf-8') as f:
    data = json.load(f)
    pg_nodes_with_dots = [node for node in data.get('nodes', []) 
                          if node.get('type') == 'nifiGroup' 
                          and '.' in node.get('data', {}).get('label', '')]
    for node in pg_nodes_with_dots[:20]:
        print(f"Label: {node['data']['label']}")
