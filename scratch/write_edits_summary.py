import json

LOG_PATH = "/Users/apple/.gemini/antigravity-ide/brain/6ef877bd-c946-4e1c-9b70-1ab83097a494/.system_generated/logs/transcript.jsonl"

out_lines = []

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
                    out_lines.append(f"--- Step {step_idx} Tool {name} ---")
                    instruction = args.get("Instruction", "")
                    description = args.get("Description", "")
                    out_lines.append(f"Instruction: {instruction}")
                    out_lines.append(f"Description: {description}")
                    
                    if "ReplacementContent" in args:
                        rc = args["ReplacementContent"]
                        out_lines.append(f"ReplacementContent length: {len(rc)}")
                    
                    if "ReplacementChunks" in args:
                        chunks = args["ReplacementChunks"]
                        out_lines.append(f"Number of chunks: {len(chunks)}")
                        for c_idx, chunk in enumerate(chunks):
                            rc = chunk.get("ReplacementContent", "")
                            tc_val = chunk.get("TargetContent", "")
                            out_lines.append(f"  Chunk {c_idx}: Target len={len(tc_val)}, Replacement len={len(rc)}")
        except Exception as e:
            pass

with open("scratch/edits_summary.txt", "w", encoding="utf-8") as f:
    f.write("\n".join(out_lines))
print("Wrote summary to scratch/edits_summary.txt")
