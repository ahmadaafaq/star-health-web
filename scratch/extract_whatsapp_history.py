import json
import os

LOG_FILE = "/Users/apple/.gemini/antigravity-ide/brain/6ef877bd-c946-4e1c-9b70-1ab83097a494/.system_generated/logs/transcript.jsonl"

keywords = ["whatsapp", "calendar", "schedule", "instant", "add to calendar"]

with open(LOG_FILE, "r") as f:
    for idx, line in enumerate(f):
        try:
            step = json.loads(line)
        except Exception:
            continue
        
        content = json.dumps(step)
        matches = [kw for kw in keywords if kw in content.lower()]
        if matches:
            tool_calls = step.get("tool_calls", [])
            for tc in tool_calls:
                name = tc.get("name", "")
                args = tc.get("args", {})
                
                # Check if it targets AIAdvisor.tsx
                target_file = args.get("TargetFile", "")
                if "AIAdvisor.tsx" not in target_file:
                    continue
                    
                args_str = json.dumps(args).lower()
                if any(kw in args_str for kw in keywords):
                    print(f"=== Step {step.get('step_index', idx)} | Tool: {name} | Matches: {matches} ===")
                    
                    if "ReplacementContent" in args:
                        print("ReplacementContent:")
                        print(args.get("ReplacementContent"))
                    elif "CodeContent" in args:
                        print("CodeContent:")
                        print(args.get("CodeContent"))
                    elif "ReplacementChunks" in args:
                        chunks = args.get("ReplacementChunks")
                        if isinstance(chunks, str):
                            try:
                                chunks = json.loads(chunks)
                            except Exception:
                                pass
                        if isinstance(chunks, list):
                            print("ReplacementChunks count:", len(chunks))
                            for c_idx, chunk in enumerate(chunks):
                                if isinstance(chunk, dict):
                                    print(f"  Chunk {c_idx} TargetContent:")
                                    print(chunk.get("TargetContent"))
                                    print(f"  Chunk {c_idx} ReplacementContent:")
                                    print(chunk.get("ReplacementContent"))
                                else:
                                    print(f"  Chunk {c_idx} (non-dict):", chunk)
                        else:
                            print("Chunks raw type:", type(chunks))
                            print(chunks)
                    print("=" * 80)
