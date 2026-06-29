import json

LOG_PATH = "/Users/apple/.gemini/antigravity-ide/brain/6ef877bd-c946-4e1c-9b70-1ab83097a494/.system_generated/logs/transcript.jsonl"

with open(LOG_PATH, 'r', encoding='utf-8') as f:
    for line in f:
        try:
            step = json.loads(line)
            if step.get("step_index") == 184:
                print("FOUND STEP 184")
                content = step.get("content", "")
                with open("scratch/step_184_diff.txt", "w", encoding="utf-8") as out:
                    out.write(content)
                print("Wrote Step 184 diff content to scratch/step_184_diff.txt")
                break
        except Exception as e:
            pass
