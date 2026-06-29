import json

LOG_PATH = "/Users/apple/.gemini/antigravity-ide/brain/6ef877bd-c946-4e1c-9b70-1ab83097a494/.system_generated/logs/transcript.jsonl"

steps_to_inspect = {132, 134, 140, 168, 177, 183, 189, 291, 297, 328, 332, 406, 412}

with open(LOG_PATH, 'r', encoding='utf-8') as f:
    for line in f:
        try:
            step = json.loads(line)
            s_idx = step.get("step_index")
            if s_idx in steps_to_inspect:
                print(f"=== STEP {s_idx} ===")
                tool_calls = step.get("tool_calls", [])
                for tc_idx, tc in enumerate(tool_calls):
                    name = tc.get("name")
                    args = tc.get("args", {})
                    print(f"  Tool: {name}")
                    for k, v in args.items():
                        v_str = str(v)
                        print(f"    {k} (len={len(v_str)}): {v_str[:300]}...")
                        if len(v_str) > 300:
                            # write to scratch file
                            out_p = f"scratch/step_{s_idx}_tc_{tc_idx}_{k}.txt"
                            with open(out_p, "w", encoding="utf-8") as outf:
                                outf.write(v_str)
                            print(f"      Wrote full value to {out_p}")
        except Exception as e:
            pass
