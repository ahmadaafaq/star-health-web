import json

LOG_PATH = "/Users/apple/.gemini/antigravity-ide/brain/6ef877bd-c946-4e1c-9b70-1ab83097a494/.system_generated/logs/transcript.jsonl"

steps_to_inspect = [177, 183]

with open(LOG_PATH, 'r', encoding='utf-8') as f:
    for line in f:
        try:
            step = json.loads(line)
            step_idx = step.get("step_index")
            if step_idx in steps_to_inspect:
                print(f"Writing complete step {step_idx} ...")
                tool_calls = step.get("tool_calls", [])
                for idx, tc in enumerate(tool_calls):
                    args = tc.get("args", {})
                    
                    if "ReplacementContent" in args:
                        out_path = f"scratch/step_{step_idx}_tool_{idx}_replacement.txt"
                        with open(out_path, "w", encoding="utf-8") as out:
                            out.write(args["ReplacementContent"])
                        print(f"  Wrote ReplacementContent to {out_path}")
                        
                    if "TargetContent" in args:
                        out_path_tgt = f"scratch/step_{step_idx}_tool_{idx}_target.txt"
                        with open(out_path_tgt, "w", encoding="utf-8") as out:
                            out.write(args["TargetContent"])
                        print(f"  Wrote TargetContent to {out_path_tgt}")
        except Exception as e:
            print("Error parsing step:", e)
