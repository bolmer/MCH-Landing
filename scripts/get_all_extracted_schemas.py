import json

with open(r'c:\Proyectos\nifi_backup\dashboard\public\data\lineage_nodes.json', 'r', encoding='utf-8') as f:
    data = json.load(f)
    extracted_schemas = set()
    for node in data.get('nodes', []):
        label = node.get('data', {}).get('label', '')
        if '.' in label:
            extracted_schemas.add(label.split('.')[0])
    
    for s in sorted(list(extracted_schemas)):
        print(s)
