import json

LOG_PATH = "/Users/apple/.gemini/antigravity-ide/brain/6ef877bd-c946-4e1c-9b70-1ab83097a494/.system_generated/logs/transcript.jsonl"
out_lines = []

with open(LOG_PATH, 'r', encoding='utf-8') as f:
    for idx, line in enumerate(f):
        if "heightclass" in line.lower():
            try:
                data = json.loads(line)
                step_idx = data.get("step_index", idx)
                if step_idx >= 2900:
                    continue
                out_lines.append(f"Step {step_idx}:")
                # find where heightclass is and extract 1000 characters before and after
                pos = line.lower().find("heightclass")
                snippet = line[max(0, pos-400):min(len(line), pos+2000)]
                out_lines.append(snippet)
                out_lines.append("*" * 80)
            except Exception:
                pass

with open("scratch/heightclass_untruncated.txt", "w", encoding="utf-8") as f:
    f.write("\n".join(out_lines))
print(f"Wrote {len(out_lines)} matches to scratch/heightclass_untruncated.txt")
