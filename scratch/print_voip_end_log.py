import json

LOG_PATH = "/Users/apple/.gemini/antigravity-ide/brain/6ef877bd-c946-4e1c-9b70-1ab83097a494/.system_generated/logs/transcript.jsonl"
target_steps = {134, 135, 140, 168, 169, 291}

with open(LOG_PATH, 'r', encoding='utf-8') as f:
    for line in f:
        try:
            step = json.loads(line)
            s_idx = step.get("step_index")
            if s_idx in target_steps:
                print(f"=== STEP {s_idx} ===")
                for tc in step.get("tool_calls", []):
                    args = tc.get("args", {})
                    for k, v in args.items():
                        v_str = str(v)
                        if "voip" in v_str.lower() or "endsession" in v_str.lower() or "active" in v_str.lower() or "startsession" in v_str.lower():
                            print(f"  {k}: {v_str[:500]}...")
                            if len(v_str) > 500:
                                with open(f"scratch/step_{s_idx}_{k}_expanded.txt", "w", encoding="utf-8") as outf:
                                    outf.write(v_str)
                                print(f"    (Expanded to scratch/step_{s_idx}_{k}_expanded.txt)")
        except Exception:
            pass
