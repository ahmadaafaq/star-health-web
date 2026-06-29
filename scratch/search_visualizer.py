import json

LOG_PATH = "/Users/apple/.gemini/antigravity-ide/brain/6ef877bd-c946-4e1c-9b70-1ab83097a494/.system_generated/logs/transcript.jsonl"
out_lines = []

with open(LOG_PATH, 'r', encoding='utf-8') as f:
    for idx, line in enumerate(f):
        if "latency ~20ms" in line.lower():
            # Let's extract step index using json or regex
            try:
                data = json.loads(line)
                step_idx = data.get("step_index", idx)
            except Exception:
                step_idx = idx
            
            # Find the word and grab 2500 chars around it
            pos = line.lower().find("latency ~20ms")
            snippet = line[max(0, pos-500):min(len(line), pos+3500)]
            out_lines.append(f"Step {step_idx} (pos={pos}):")
            out_lines.append(snippet)
            out_lines.append("=" * 80)

with open("scratch/visualizer_matches.txt", "w", encoding="utf-8") as f:
    f.write("\n".join(out_lines))
print(f"Wrote {len(out_lines)} matches to scratch/visualizer_matches.txt")
