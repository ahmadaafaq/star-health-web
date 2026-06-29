import json

log_path = "/Users/apple/.gemini/antigravity-ide/brain/6ef877bd-c946-4e1c-9b70-1ab83097a494/.system_generated/logs/transcript.jsonl"

with open(log_path, 'r', encoding='utf-8') as f:
    for line in f:
        try:
            step = json.loads(line)
            step_idx = step.get("step_index")
            if step_idx == 1548:
                if "tool_calls" in step:
                    for tc in step["tool_calls"]:
                        args = tc.get("args", {})
                        if isinstance(args, str):
                            args = json.loads(args)
                        if "ReplacementContent" in args:
                            content = args["ReplacementContent"]
                            # Clean up escaping
                            # If content is a json-serialized string, decode it
                            if isinstance(content, str):
                                # Replace backslash-n with actual newlines
                                content_clean = content.replace("\\n", "\n").replace("\\\"", "\"").replace("\\\\", "\\")
                                # If it has leading/trailing quotes, remove them
                                if content_clean.startswith('"') and content_clean.endswith('"'):
                                    content_clean = content_clean[1:-1]
                            with open("/Users/apple/Documents/ai - projects/star-health-web/scratch/step_1548_full_content.txt", "w", encoding="utf-8") as out:
                                out.write(content_clean)
                            print("Wrote clean content to step_1548_full_content.txt successfully.")
        except Exception as e:
            pass
