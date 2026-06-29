import json
import glob
import os

files = glob.glob("scratch/step_*_replacement.txt")
files.extend(glob.glob("scratch/step_*_code.txt"))

for fpath in files:
    try:
        with open(fpath, "r", encoding="utf-8") as f:
            content = f.read()
        
        # Strip header if it's there
        if "modified to include a line number" in content or "Showing lines" in content:
            lines = content.split("\n")
            # Parse line by line to find the json string
            for line in lines:
                if line.startswith("1:") or line.startswith('"'):
                    content = line
                    break
        
        # If it starts with line number, remove it
        if content.startswith("1:"):
            content = content[2:].strip()
            
        # Parse as JSON string
        try:
            parsed = json.loads(content)
        except Exception:
            # Try parsing with strict=False
            parsed = json.loads(content, strict=False)
            
        out_fpath = fpath.replace("_replacement.txt", "_clean.txt").replace("_code.txt", "_clean.txt")
        with open(out_fpath, "w", encoding="utf-8") as out:
            out.write(parsed)
        print(f"Parsed {fpath} -> {out_fpath}")
    except Exception as e:
        print(f"Failed to parse {fpath}: {e}")
