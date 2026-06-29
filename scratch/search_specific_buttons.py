import json

LOG_PATH = "/Users/apple/.gemini/antigravity-ide/brain/6ef877bd-c946-4e1c-9b70-1ab83097a494/.system_generated/logs/transcript.jsonl"

with open(LOG_PATH, 'r', encoding='utf-8') as f:
    for line_idx, line in enumerate(f):
        try:
            step = json.loads(line)
            step_str = json.dumps(step)
            # Look for step containing "add to calendar" or "whatsapp" or "schedule a call"
            if "add to calendar" in step_str.lower() or "send policy" in step_str.lower():
                print(f"Match in Step {step.get('step_index', line_idx)} (Type: {step.get('type')})")
                tool_calls = step.get("tool_calls", [])
                for tc in tool_calls:
                    print("  Tool name:", tc.get("name"))
                    args = tc.get("args", {})
                    # Print anything that looks like code
                    for k, v in args.items():
                        if isinstance(v, str) and ("whatsapp" in v.lower() or "calendar" in v.lower() or "schedule" in v.lower()):
                            print(f"    Arg '{k}' contains match. Length: {len(v)}")
                            # Print snippets around matches
                            for match in ["whatsapp", "calendar", "schedule", "send"]:
                                idx = v.lower().find(match)
                                if idx != -1:
                                    print(f"      Context around '{match}': {v[max(0, idx-100):min(len(v), idx+150)]}")
                                    print("      " + "-"*30)
                print("=" * 80)
        except Exception as e:
            pass
