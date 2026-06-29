LOG_PATH = "/Users/apple/.gemini/antigravity-ide/brain/6ef877bd-c946-4e1c-9b70-1ab83097a494/.system_generated/logs/transcript.jsonl"

with open(LOG_PATH, 'r', encoding='utf-8') as f:
    for idx, line in enumerate(f):
        if "endsession" in line.lower():
            # find all occurrences in this line
            start = 0
            while True:
                pos = line.lower().find("endsession", start)
                if pos == -1:
                    break
                print(f"Step {idx}: Position {pos}")
                # print 300 characters before and after
                snippet = line[max(0, pos-200):min(len(line), pos+200)]
                print("Context:")
                print(snippet)
                print("-" * 50)
                start = pos + 1
