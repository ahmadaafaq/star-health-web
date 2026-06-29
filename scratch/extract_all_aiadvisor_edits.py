import json

LOG_PATH = "/Users/apple/.gemini/antigravity-ide/brain/6ef877bd-c946-4e1c-9b70-1ab83097a494/.system_generated/logs/transcript.jsonl"

with open(LOG_PATH, 'r', encoding='utf-8') as f:
    for idx, line in enumerate(f):
        try:
            step = json.loads(line)
            step_idx = step.get("step_index", idx)
            tool_calls = step.get("tool_calls", [])
            for tc_idx, tc in enumerate(tool_calls):
                name = tc.get("name", "")
                args = tc.get("args", {})
                
                # Check if this tool edit affects AIAdvisor.tsx
                target_file = args.get("TargetFile", "")
                if "AIAdvisor.tsx" in target_file:
                    print(f"--- Step {step_idx} Tool {name} ---")
                    instruction = args.get("Instruction", "")
                    description = args.get("Description", "")
                    print(f"Instruction: {instruction}")
                    print(f"Description: {description}")
                    
                    if "ReplacementContent" in args:
                        rc = args["ReplacementContent"]
                        print(f"ReplacementContent length: {len(rc)}")
                        # write to file
                        out_p = f"scratch/step_{step_idx}_tc_{tc_idx}_replacement.txt"
                        with open(out_p, "w", encoding="utf-8") as outf:
                            outf.write(rc)
                        print(f"Wrote replacement content to {out_p}")
                    
                    if "ReplacementChunks" in args:
                        chunks = args["ReplacementChunks"]
                        print(f"Number of chunks: {len(chunks)}")
                        for c_idx, chunk in enumerate(chunks):
                            rc = chunk.get("ReplacementContent", "")
                            tc_val = chunk.get("TargetContent", "")
                            print(f"  Chunk {c_idx}: Target len={len(tc_val)}, Replacement len={len(rc)}")
                            out_p = f"scratch/step_{step_idx}_tc_{tc_idx}_chunk_{c_idx}_rep.txt"
                            with open(out_p, "w", encoding="utf-8") as outf:
                                outf.write(rc)
                            out_t = f"scratch/step_{step_idx}_tc_{tc_idx}_chunk_{c_idx}_tgt.txt"
                            with open(out_t, "w", encoding="utf-8") as outf:
                                outf.write(tc_val)
        except Exception as e:
            # print("Err:", e)
            pass
