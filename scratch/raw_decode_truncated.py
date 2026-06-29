import glob
import re

files = glob.glob("scratch/step_*_replacement.txt")
files.extend(glob.glob("scratch/step_*_code.txt"))
files.extend(glob.glob("scratch/step_*_target.txt"))

for fpath in files:
    try:
        with open(fpath, "r", encoding="utf-8") as f:
            content = f.read()
        
        # Extract the line containing the quoted string
        lines = content.split("\n")
        json_str = ""
        for line in lines:
            if line.startswith("1:") or line.startswith('"'):
                json_str = line
                break
        
        if json_str.startswith("1:"):
            # strip "1:" and surrounding whitespace
            json_str = json_str[2:].strip()
            
        # Strip outer quotes
        if json_str.startswith('"'):
            json_str = json_str[1:]
        if json_str.endswith('"'):
            json_str = json_str[:-1]
            
        # Manually decode common escape sequences
        decoded = json_str
        # Replace escaped newlines
        decoded = decoded.replace("\\n", "\n")
        # Replace escaped quotes
        decoded = decoded.replace('\\"', '"')
        # Replace escaped backslashes
        decoded = decoded.replace("\\\\", "\\")
        # Replace other common ones
        decoded = decoded.replace("\\t", "\t")
        
        out_fpath = fpath.replace("_replacement.txt", "_clean.txt").replace("_code.txt", "_clean.txt").replace("_target.txt", "_clean_target.txt")
        with open(out_fpath, "w", encoding="utf-8") as out:
            out.write(decoded)
        print(f"Decoded {fpath} -> {out_fpath}")
    except Exception as e:
        print(f"Failed to decode {fpath}: {e}")
