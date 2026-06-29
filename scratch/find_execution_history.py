import json

LOG_PATH = "/Users/apple/.gemini/antigravity-ide/brain/6ef877bd-c946-4e1c-9b70-1ab83097a494/.system_generated/logs/transcript.jsonl"

with open(LOG_PATH, 'r', encoding='utf-8') as f:
    for line_idx, line in enumerate(f):
        try:
            step = json.loads(line)
            step_idx = step.get("step_index")
            tool_calls = step.get("tool_calls", [])
            for tc in tool_calls:
                if tc.get("name") == "run_command":
                    cmd = tc.get("args", {}).get("CommandLine", "")
                    if "python" in cmd or "git" in cmd:
                        print(f"Step {step_idx}: {cmd}")
        except Exception as e:
            pass
