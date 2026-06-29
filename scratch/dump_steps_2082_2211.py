import json

LOG_PATH = "/Users/apple/.gemini/antigravity-ide/brain/6ef877bd-c946-4e1c-9b70-1ab83097a494/.system_generated/logs/transcript.jsonl"

steps_to_inspect = [2082, 2088, 2211]

with open(LOG_PATH, 'r', encoding='utf-8') as f:
    for line in f:
        try:
            step = json.loads(line)
            step_idx = step.get("step_index")
            if step_idx in steps_to_inspect:
                print(f"==========================================")
                print(f"STEP {step_idx} details:")
                print("Type:", step.get("type"))
                print("Status:", step.get("status"))
                
                # Check tool calls
                tool_calls = step.get("tool_calls", [])
                for tc in tool_calls:
                    print("Tool name:", tc.get("name"))
                    args = tc.get("args", {})
                    print("Args keys:", list(args.keys()))
                    for k in ["AbsolutePath", "TargetFile", "CommandLine", "Cwd"]:
                        if k in args:
                            print(f"  {k}: {args[k]}")
                
                # Check content/response
                content = step.get("content", "")
                print("Content length:", len(content))
                # Let's save the content to a file to prevent truncation
                out_path = f"scratch/step_{step_idx}_content.txt"
                with open(out_path, "w", encoding="utf-8") as out:
                    out.write(content)
                print(f"Wrote step content to {out_path}")
                
                # Check output/response
                response = step.get("response", "")
                if response:
                    print("Response length:", len(str(response)))
                    out_path_resp = f"scratch/step_{step_idx}_response.txt"
                    with open(out_path_resp, "w", encoding="utf-8") as out_resp:
                        out_resp.write(str(response))
                    print(f"Wrote step response to {out_path_resp}")
                    
        except Exception as e:
            print("Error parsing step:", e)
