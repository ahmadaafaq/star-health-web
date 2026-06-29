import json

LOG_PATH = "/Users/apple/.gemini/antigravity-ide/brain/6ef877bd-c946-4e1c-9b70-1ab83097a494/.system_generated/logs/transcript.jsonl"

steps_to_inspect = [178, 184, 1404]

with open(LOG_PATH, 'r', encoding='utf-8') as f:
    for line in f:
        try:
            step = json.loads(line)
            step_idx = step.get("step_index")
            if step_idx in steps_to_inspect:
                print(f"==========================================")
                print(f"STEP {step_idx} details:")
                print("Type:", step.get("type"))
                print("Status:", step.get("status"))
                
                # Check tool calls
                tool_calls = step.get("tool_calls", [])
                for tc in tool_calls:
                    print("Tool name:", tc.get("name"))
                    args = tc.get("args", {})
                    print("Args keys:", list(args.keys()))
                    for k, v in args.items():
                        if k in ["TargetFile", "CommandLine", "Cwd"]:
                            print(f"  {k}: {v}")
                        elif k in ["ReplacementContent", "CodeContent", "ReplacementChunks"]:
                            print(f"  {k} snippet:")
                            print(str(v)[:1500])
                    print("." * 40)
        except Exception as e:
            print("Error parsing step:", e)
