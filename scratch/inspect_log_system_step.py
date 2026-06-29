import json
import os
import sys

log_path = "/Users/apple/.gemini/antigravity-ide/brain/6ef877bd-c946-4e1c-9b70-1ab83097a494/.system_generated/logs/transcript.jsonl"

found = False
with open(log_path, 'r', encoding='utf-8') as f:
    for line in f:
        try:
            step = json.loads(line)
            if found:
                print("KEYS of next step:", list(step.keys()))
                print("Source:", step.get("source"))
                print("Type:", step.get("type"))
                print("Status:", step.get("status"))
                print("Content (truncated):", repr(step.get("content", "")[:200]))
                sys.exit(0)
            
            if "tool_calls" in step and step["tool_calls"]:
                for tc in step["tool_calls"]:
                    if tc.get("name") == "view_file":
                        print("Found view_file at step:", step.get("step_index"))
                        found = True
                        break
        except Exception as e:
            pass
