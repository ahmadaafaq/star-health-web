import os

files = sorted(os.listdir("scratch"))
for f in files:
    if f.startswith("step_") and (f.endswith("ReplacementContent.txt") or f.endswith("replacement.txt") or f.endswith("clean.txt")):
        path = os.path.join("scratch", f)
        print(f"File: {f} (size={os.path.getsize(path)})")
        with open(path, "r", encoding="utf-8") as file:
            content = file.read()
            # print first 150 chars and last 150 chars
            lines = content.splitlines()
            print(f"  Lines: {len(lines)}")
            print("  [START]")
            for line in lines[:10]:
                print(f"    {line}")
            if len(lines) > 20:
                print("    ...")
            for line in lines[-10:]:
                print(f"    {line}")
            print("  [END]")
            print("-" * 50)
