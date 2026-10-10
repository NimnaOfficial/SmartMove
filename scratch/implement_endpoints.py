import os
import re

def process_controller(filepath):
    with open(filepath, 'r') as f:
        content = f.read()

    match = re.search(r'public class (\w+)Controller', content)
    if not match:
        return
    entity_name = match.group(1)

    # First fix the Delete endpoints
    content = re.sub(
        r'(@DeleteMapping\([^)]+\)\s*public org\.springframework\.http\.ResponseEntity<\?> \w+\(@PathVariable Long id\)\s*\{\s*)return org\.springframework\.http\.ResponseEntity\.ok\(\)\.build\(\);',
        r'\1service.deleteById(id);\n        return org.springframework.http.ResponseEntity.ok().build();',
        content,
        flags=re.DOTALL
    )

    # Replace @RequestBody payload saving
    # We want to replace `return org.springframework.http.ResponseEntity.ok().build();` with `return org.springframework.http.ResponseEntity.ok(service.save(payload));`
    # ONLY inside POST and PUT methods that have `@RequestBody EntityName payload`
    
    # We can split the content by endpoints
    endpoints = re.split(r'(?=@(?:GetMapping|PostMapping|PutMapping|DeleteMapping))', content)
    
    new_endpoints = []
    for ep in endpoints:
        if ('@PostMapping' in ep or '@PutMapping' in ep) and f'@RequestBody {entity_name} payload' in ep:
            ep = ep.replace('return org.springframework.http.ResponseEntity.ok().build();', 'return org.springframework.http.ResponseEntity.ok(service.save(payload));')
        new_endpoints.append(ep)
        
    content = ''.join(new_endpoints)

    with open(filepath, 'w') as f:
        f.write(content)

def main():
    services_dir = 'services'
    for root, dirs, files in os.walk(services_dir):
        for file in files:
            if file.endswith('Controller.java'):
                process_controller(os.path.join(root, file))
                print(f"Processed {file}")

if __name__ == "__main__":
    main()
