import json

LOG_PATH = "/Users/apple/.gemini/antigravity-ide/brain/6ef877bd-c946-4e1c-9b70-1ab83097a494/.system_generated/logs/transcript.jsonl"

for step_idx in range(170, 190):
    with open(LOG_PATH, 'r', encoding='utf-8') as f:
        for line in f:
            try:
                step = json.loads(line)
                if step.get("step_index") == step_idx:
                    print(f"==========================================")
                    print(f"STEP {step_idx} details:")
                    print("Type:", step.get("type"))
                    print("Source:", step.get("source"))
                    tool_calls = step.get("tool_calls", [])
                    print("Tool calls count:", len(tool_calls))
                    for tc in tool_calls:
                        print("  Name:", tc.get("name"))
                        args = tc.get("args", {})
                        print("  Args keys:", list(args.keys()))
                        if "ReplacementContent" in args:
                            print("  ReplacementContent:")
                            print(args["ReplacementContent"])
                        if "CodeContent" in args:
                            print("  CodeContent:")
                            print(args["CodeContent"])
            except Exception as e:
                pass
