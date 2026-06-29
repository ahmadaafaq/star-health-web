import json

LOG_PATH = "/Users/apple/.gemini/antigravity-ide/brain/6ef877bd-c946-4e1c-9b70-1ab83097a494/.system_generated/logs/transcript.jsonl"

with open(LOG_PATH, 'r', encoding='utf-8') as f:
    for idx, line in enumerate(f):
        try:
            step = json.loads(line)
            step_str = json.dumps(step)
            if "endsession" in step_str.lower() or "closecall" in step_str.lower() or "disconnect" in step_str.lower():
                print(f"Step {step.get('step_index')}: found keyword")
                # let's see tool calls
                for tc in step.get("tool_calls", []):
                    args = tc.get("args", {})
                    for k, v in args.items():
                        if "endsession" in str(v).lower() or "disconnect" in str(v).lower():
                            print(f"  Arg {k}: {str(v)[:200]}")
        except Exception:
            pass
