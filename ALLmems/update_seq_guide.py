import os

directory = r"C:\Users\SANDANIMNE\Desktop\code ss\SmartMove\SmartMove\ALLmems"

filepath = os.path.join(directory, "SmartMove_Full_Member_Implementation_Guide.md")

with open(filepath, 'r', encoding='cp1252', errors='ignore') as f:
    content = f.read()

# Replace SEQ_TRIP with SEQ_TRIPS
new_content = content.replace("SEQ_TRIP", "SEQ_TRIPS")

if new_content != content:
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(new_content)
    print("Updated SmartMove_Full_Member_Implementation_Guide.md")
else:
    print("No changes needed in SmartMove_Full_Member_Implementation_Guide.md")

