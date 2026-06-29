import json

LOG_PATH = "/Users/apple/.gemini/antigravity-ide/brain/6ef877bd-c946-4e1c-9b70-1ab83097a494/.system_generated/logs/transcript.jsonl"

with open(LOG_PATH, 'r', encoding='utf-8') as f:
    for idx, line in enumerate(f):
        try:
            step = json.loads(line)
            step_idx = step.get("step_index", idx)
            if step_idx == 184:
                print(f"Step 184 Keys: {list(step.keys())}")
                if "content" in step:
                    # Write the content to scratch
                    with open("scratch/step_184_full_untruncated_content.txt", "w", encoding="utf-8") as out:
                        out.write(step["content"])
                    print("Saved content to scratch/step_184_full_untruncated_content.txt")
        except Exception as e:
            pass
