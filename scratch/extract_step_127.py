import json

LOG_PATH = "/Users/apple/.gemini/antigravity-ide/brain/6ef877bd-c946-4e1c-9b70-1ab83097a494/.system_generated/logs/transcript.jsonl"

with open(LOG_PATH, 'r', encoding='utf-8') as f:
    for idx, line in enumerate(f):
        try:
            step = json.loads(line)
            step_idx = step.get("step_index", idx)
            if step_idx == 127:
                print(f"Step 127 keys: {list(step.keys())}")
                # print any response or content or tool output
                if "response" in step:
                    resp = str(step["response"])
                    print(f"Response length: {len(resp)}")
                    with open("scratch/step_127_response.txt", "w", encoding="utf-8") as out:
                        out.write(resp)
                    print("Wrote response to scratch/step_127_response.txt")
                if "content" in step:
                    cnt = str(step["content"])
                    print(f"Content length: {len(cnt)}")
                    with open("scratch/step_127_content.txt", "w", encoding="utf-8") as out:
                        out.write(cnt)
                    print("Wrote content to scratch/step_127_content.txt")
                
                # Check tool_calls or anything else
                for tc in step.get("tool_calls", []):
                    print(f"Tool call name: {tc.get('name')}")
                    # If this step had tool response, check it
                
        except Exception as e:
            pass
