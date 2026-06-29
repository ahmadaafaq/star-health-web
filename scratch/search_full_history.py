import json

LOG_PATH = "/Users/apple/.gemini/antigravity-ide/brain/6ef877bd-c946-4e1c-9b70-1ab83097a494/.system_generated/logs/transcript.jsonl"

with open(LOG_PATH, 'r', encoding='utf-8') as f:
    for idx, line in enumerate(f):
        try:
            step = json.loads(line)
            # Find where calendar appears in any part of the step content
            step_str = json.dumps(step)
            if "calendar" in step_str.lower() or "schedule a call" in step_str.lower() or "instant call" in step_str.lower():
                print(f"Match in Step {step.get('step_index')} (Type: {step.get('type')}, Status: {step.get('status')})")
                print("Matches:", [w for w in ["calendar", "schedule a call", "instant call"] if w in step_str.lower()])
                # Print keys or summary
                for k, v in step.items():
                    if k not in ["content", "tool_calls"]:
                        print(f"  {k}: {str(v)[:200]}")
                print("-" * 60)
        except Exception as e:
            pass
