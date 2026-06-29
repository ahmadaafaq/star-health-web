import json

LOG_PATH = "/Users/apple/.gemini/antigravity-ide/brain/6ef877bd-c946-4e1c-9b70-1ab83097a494/.system_generated/logs/transcript.jsonl"

with open(LOG_PATH, 'r', encoding='utf-8') as f:
    for idx, line in enumerate(f):
        try:
            step = json.loads(line)
            if step.get("type") == "USER_INPUT":
                content = step.get("content", "")
                if any(kw in content.lower() for kw in ["whatsapp", "calendar", "schedule", "instant"]):
                    print(f"Step {step.get('step_index')}: {content}")
                    print("-" * 60)
        except Exception as e:
            pass
