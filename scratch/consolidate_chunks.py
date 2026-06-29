import json
import os

steps = [132, 134, 140, 168, 177, 183, 189, 291, 297, 328, 332, 406, 412]

out_lines = []

for s in steps:
    for tc_idx in [0, 1]:
        # check if ReplacementContent or replacement.txt exists
        for suffix in ["ReplacementContent.txt", "replacement.txt", "clean.txt"]:
            fname = f"step_{s}_tc_{tc_idx}_{suffix}"
            path = os.path.join("scratch", fname)
            if os.path.exists(path):
                with open(path, "r", encoding="utf-8") as f:
                    content = f.read()
                # If it's a JSON-stringified value (like in some raw steps), try to unescape it
                if (content.startswith('"') and content.endswith('"')) or (content.startswith("'") and content.endswith("'")):
                    try:
                        # try loading as json
                        unescaped = json.loads(content)
                    except Exception:
                        unescaped = content
                else:
                    unescaped = content
                
                out_lines.append(f"==================================================")
                out_lines.append(f"STEP {s} TC {tc_idx} SUFFIX {suffix}")
                out_lines.append(f"==================================================")
                out_lines.append(unescaped)
                out_lines.append("\n\n")

with open("scratch/voip_whatsapp_restored_chunks.txt", "w", encoding="utf-8") as f:
    f.write("\n".join(out_lines))

print("Wrote consolidated chunks to scratch/voip_whatsapp_restored_chunks.txt")
