import json

LOG_PATH = "/Users/apple/.gemini/antigravity-ide/brain/6ef877bd-c946-4e1c-9b70-1ab83097a494/.system_generated/logs/transcript.jsonl"

steps_to_inspect = [244, 424, 1315, 1850]

with open(LOG_PATH, 'r', encoding='utf-8') as f:
    for line in f:
        try:
            step = json.loads(line)
            step_idx = step.get("step_index")
            if step_idx in steps_to_inspect:
                print(f"==========================================")
                print(f"STEP {step_idx} details:")
                print("Type:", step.get("type"))
                
                tool_calls = step.get("tool_calls", [])
                for tc in tool_calls:
                    print("  Tool name:", tc.get("name"))
                    args = tc.get("args", {})
                    print("  Args:", args)
                
                # Check response content if it viewed AIAdvisor.tsx
                response = step.get("response", "")
                if not response and "content" in step:
                    response = step["content"]
                
                if response:
                    print("  Response length:", len(str(response)))
                    # Find if "handleSendWhatsapp" or "voipActive" or "calendar" is in the response
                    resp_str = str(response).lower()
                    print("  Contains handleSendWhatsapp:", "handlesendwhatsapp" in resp_str)
                    print("  Contains voipActive:", "voipactive" in resp_str)
                    print("  Contains calendar:", "calendar" in resp_str)
                    
                    # Write to file
                    out_path = f"scratch/step_{step_idx}_view_content.txt"
                    with open(out_path, "w", encoding="utf-8") as out:
                        out.write(str(response))
                    print(f"  Wrote content to {out_path}")
        except Exception as e:
            print("Error parsing step:", e)
