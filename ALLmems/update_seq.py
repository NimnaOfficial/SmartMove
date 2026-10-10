import os

directory = r"C:\Users\SANDANIMNE\Desktop\code ss\SmartMove\SmartMove\ALLmems"

files_to_update = [
    "Oracle_Setup.sql",
    "Oracle_TestData.sql",
    "SmartMove_Full_Member_Implementation_Guide.md"
]

for filename in files_to_update:
    filepath = os.path.join(directory, filename)
    if os.path.exists(filepath):
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Replace SEQ_TRIP with SEQ_TRIPS
        new_content = content.replace("SEQ_TRIP", "SEQ_TRIPS")
        
        if new_content != content:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(new_content)
            print(f"Updated {filename}")
        else:
            print(f"No changes needed in {filename}")
    else:
        print(f"File not found: {filename}")

print("Update process completed.")
