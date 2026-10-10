import os
import re

env_file = r"C:\Users\SANDANIMNE\Desktop\code ss\SmartMove\SmartMove\ALLmems\credentials.env"
services_dir = r"C:\Users\SANDANIMNE\Desktop\code ss\SmartMove\SmartMove\services"

# Read credentials
creds = {}
with open(env_file, 'r') as f:
    for line in f:
        line = line.strip()
        if not line or line.startswith('#'): continue
        if '=' in line:
            key, val = line.split('=', 1)
            creds[key] = val.strip('"')

mongo_uri = creds.get('MONGODB_URI')
oracle_conn_string = creds.get('ORACLE_CONNECTION_STRING')
oracle_user = creds.get('DATABASE_USERNAME')
oracle_pass = creds.get('DATABASE_PASSWORD')

# Target files
prop_files = []
for root, dirs, files in os.walk(services_dir):
    for file in files:
        if file == 'application.properties':
            prop_files.append(os.path.join(root, file))

for p in prop_files:
    with open(p, 'r') as f:
        lines = f.readlines()
        
    new_lines = []
    updated = False
    
    for line in lines:
        if line.startswith('spring.datasource.url='):
            new_lines.append(f'spring.datasource.url=jdbc:oracle:thin:@{oracle_conn_string}\n')
            updated = True
        elif line.startswith('spring.datasource.username='):
            new_lines.append(f'spring.datasource.username={oracle_user}\n')
            updated = True
        elif line.startswith('spring.datasource.password='):
            new_lines.append(f'spring.datasource.password={oracle_pass}\n')
            updated = True
        elif line.startswith('spring.data.mongodb.uri='):
            new_lines.append(f'spring.data.mongodb.uri={mongo_uri}/smartmove\n')
            updated = True
        else:
            new_lines.append(line)
            
    if updated:
        with open(p, 'w') as f:
            f.writelines(new_lines)
        print(f"Updated {p}")
        
print("All DB credentials updated.")
