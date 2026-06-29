import json

LOG_PATH = "/Users/apple/.gemini/antigravity-ide/brain/6ef877bd-c946-4e1c-9b70-1ab83097a494/.system_generated/logs/transcript.jsonl"

with open(LOG_PATH, 'r', encoding='utf-8') as f:
    for line in f:
        try:
            step = json.loads(line)
            s_idx = step.get("step_index")
            if s_idx in {177, 183}:
                print(f"=== STEP {s_idx} ===")
                for tc in step.get("tool_calls", []):
                    args = tc.get("args", {})
                    for k, v in args.items():
                        v_str = str(v)
                        print(f"  Arg {k} length: {len(v_str)}")
                        # Write the full value to a file
                        out_p = f"scratch/step_{s_idx}_{k}_raw_untruncated.txt"
                        with open(out_p, "w", encoding="utf-8") as outf:
                            outf.write(v_str)
                        print(f"    Saved raw value to {out_p}")
        except Exception as e:
            pass
