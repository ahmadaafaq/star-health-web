import json

LOG_PATH = "/Users/apple/.gemini/antigravity-ide/brain/6ef877bd-c946-4e1c-9b70-1ab83097a494/.system_generated/logs/transcript.jsonl"
out_lines = []

with open(LOG_PATH, 'r', encoding='utf-8') as f:
    for idx, line in enumerate(f):
        if "endsession" in line.lower():
            # Let's extract step index using json or regex
            try:
                data = json.loads(line)
                step_idx = data.get("step_index", idx)
            except Exception:
                step_idx = idx
            
            # Find the word endsession and grab context
            pos = line.lower().find("endsession")
            context = line[max(0, pos-150):min(len(line), pos+250)]
            out_lines.append(f"Step {step_idx}: ...{context}...")

with open("scratch/endsession_any_matches.txt", "w", encoding="utf-8") as f:
    f.write("\n".join(out_lines))
print(f"Wrote {len(out_lines)} matches to scratch/endsession_any_matches.txt")
