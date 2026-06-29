import json

log_path = "/Users/apple/.gemini/antigravity-ide/brain/6ef877bd-c946-4e1c-9b70-1ab83097a494/.system_generated/logs/transcript.jsonl"

with open(log_path, 'r', encoding='utf-8') as f:
    for line in f:
        try:
            step = json.loads(line)
            if "tool_calls" in step:
                for tc in step["tool_calls"]:
                    if tc.get("name") == "run_command":
                        cmd = tc.get("args", {}).get("CommandLine", "")
                        print(f"Step {step.get('step_index')}: {cmd}")
        except:
            pass
