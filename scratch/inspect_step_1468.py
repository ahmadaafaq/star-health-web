import json

LOG_FILE = "/Users/apple/.gemini/antigravity-ide/brain/6ef877bd-c946-4e1c-9b70-1ab83097a494/.system_generated/logs/transcript.jsonl"

with open(LOG_FILE, "r") as f:
    for idx, line in enumerate(f):
        try:
            step = json.loads(line)
        except Exception:
            continue
        
        if step.get('step_index') == 1468:
            print("FOUND STEP 1468")
            tool_calls = step.get("tool_calls", [])
            for tc in tool_calls:
                args = tc.get("args", {})
                chunks = args.get("ReplacementChunks")
                if isinstance(chunks, str):
                    chunks = json.loads(chunks, strict=False)
                for c_idx, chunk in enumerate(chunks):
                    print(f"--- Chunk {c_idx} ---")
                    print("StartLine:", chunk.get("StartLine"))
                    print("EndLine:", chunk.get("EndLine"))
                    print("TargetContent:")
                    print(chunk.get("TargetContent"))
                    print("ReplacementContent:")
                    print(chunk.get("ReplacementContent"))
                    print("="*40)
            break
