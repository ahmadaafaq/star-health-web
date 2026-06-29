import os

scratch_dir = "/Users/apple/Documents/ai - projects/star-health-web/scratch"

for filename in os.listdir(scratch_dir):
    filepath = os.path.join(scratch_dir, filename)
    if os.path.isfile(filepath) and filename.endswith(".py"):
        size = os.path.getsize(filepath)
        if size > 0:
            print(f"File: {filename} (size: {size} bytes)")
            try:
                with open(filepath, "r", encoding="utf-8") as f:
                    print("--- CONTENT ---")
                    print(f.read()[:500])
                    print("---------------\n")
            except Exception as e:
                print("Error reading:", e)
