import os

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
            creds[key] = val.strip().strip('"').strip("'")

mongo_uri = creds.get('MONGODB_URI')
mongo_db = creds.get('MONGODB_DB_NAME', 'SMARTMOVE')
oracle_jdbc_url = creds.get('ORACLE_JDBC_URL', 'jdbc:oracle:thin:@localhost:1521:xe')
oracle_user = creds.get('DATABASE_USERNAME', 'system')
oracle_pass = creds.get('DATABASE_PASSWORD', 'root')
oracle_schema = creds.get('ORACLE_DB_SCHEMA', 'SYSTEM')

# Target files
prop_files = []
for root, dirs, files in os.walk(services_dir):
    if 'target' in root:
        continue
    for file in files:
        if file == 'application.properties':
            prop_files.append(os.path.join(root, file))

for p in prop_files:
    service_name = os.path.basename(os.path.dirname(os.path.dirname(os.path.dirname(p))))
    with open(p, 'r') as f:
        lines = f.readlines()
        
    new_lines = []
    is_oracle = False
    has_schema = False
    has_dialect = False
    
    for line in lines:
        stripped = line.strip()
        if stripped.startswith('spring.datasource.url='):
            new_lines.append(f'spring.datasource.url={oracle_jdbc_url}\n')
            is_oracle = True
        elif stripped.startswith('spring.datasource.username='):
            new_lines.append(f'spring.datasource.username={oracle_user}\n')
            is_oracle = True
        elif stripped.startswith('spring.datasource.password='):
            new_lines.append(f'spring.datasource.password=${{SMARTMOVE_DB_PASSWORD:{oracle_pass}}}\n')
            is_oracle = True
        elif stripped.startswith('spring.datasource.driver-class-name='):
            new_lines.append('spring.datasource.driver-class-name=oracle.jdbc.OracleDriver\n')
            is_oracle = True
        elif stripped.startswith('spring.jpa.properties.hibernate.default_schema='):
            new_lines.append(f'spring.jpa.properties.hibernate.default_schema={oracle_schema}\n')
            has_schema = True
        elif stripped.startswith('spring.jpa.properties.hibernate.dialect='):
            new_lines.append('spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.OracleDialect\n')
            has_dialect = True
        elif stripped.startswith('spring.data.mongodb.uri='):
            new_lines.append(f'spring.data.mongodb.uri={mongo_uri}/{mongo_db}\n')
        elif stripped.startswith('spring.data.mongodb.database='):
            new_lines.append(f'spring.data.mongodb.database={mongo_db}\n')
        else:
            new_lines.append(line)
            
    # Inject missing Oracle settings if this is an Oracle service
    if is_oracle:
        if not has_schema:
            new_lines.append(f'spring.jpa.properties.hibernate.default_schema={oracle_schema}\n')
        if not has_dialect:
            new_lines.append('spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.OracleDialect\n')

    with open(p, 'w') as f:
        f.writelines(new_lines)
    print(f"Updated {service_name}: {p}")

print("All microservice database configurations migrated to local Oracle XE.")
