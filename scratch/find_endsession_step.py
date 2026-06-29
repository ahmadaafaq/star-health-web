import json
import re

LOG_PATH = "/Users/apple/.gemini/antigravity-ide/brain/6ef877bd-c946-4e1c-9b70-1ab83097a494/.system_generated/logs/transcript.jsonl"
out_lines = []

with open(LOG_PATH, 'r', encoding='utf-8') as f:
    for idx, line in enumerate(f):
        if "endsession" in line.lower() and "model" in line.lower():
            try:
                step = json.loads(line)
                step_idx = step.get("step_index", idx)
                # skip our own steps (e.g. step >= 2900)
                if step_idx >= 2900:
                    continue
                tool_calls = step.get("tool_calls", [])
                for tc_idx, tc in enumerate(tool_calls):
                    args = tc.get("args", {})
                    for k, v in args.items():
                        v_str = str(v)
                        if "endsession" in v_str.lower():
                            out_lines.append(f"Match found in Step {step_idx} Tool {tc.get('name')} Arg {k}")
                            match = re.search(r"(const\s+handleEndVoipCall\s*=\s*async\s*\(\)\s*=>\s*\{.*?\})", v_str, re.DOTALL | re.IGNORECASE)
                            if match:
                                out_lines.append("Found handleEndVoipCall:")
                                out_lines.append(match.group(1))
                            else:
                                lines = v_str.split("\n")
                                for l_idx, l in enumerate(lines):
                                    if "endsession" in l.lower() or "handleendvoip" in l.lower():
                                        out_lines.append(f"Line {l_idx}: {l}")
                                        for offset in range(-5, 6):
                                            n = l_idx + offset
                                            if 0 <= n < len(lines):
                                                out_lines.append(f"  {n}: {lines[n]}")
                            out_lines.append("=" * 60)
            except Exception as e:
                pass

with open("scratch/endsession_matches.txt", "w", encoding="utf-8") as f:
    f.write("\n".join(out_lines))
print("Wrote matches to scratch/endsession_matches.txt")
