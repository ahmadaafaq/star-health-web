import os

scratch_dir = "/Users/apple/Documents/ai - projects/star-health-web/scratch"

search_terms = ["TRUST_CAROUSEL_ITEMS", "Congratulations", "Choice Completed", "LOADER_STEPS"]

for filename in os.listdir(scratch_dir):
    filepath = os.path.join(scratch_dir, filename)
    if os.path.isfile(filepath) and filename.endswith((".txt", ".json", ".py", ".ts", ".tsx", ".diff")):
        try:
            with open(filepath, "r", encoding="utf-8") as f:
                content = f.read()
                for term in search_terms:
                    if term in content:
                        print(f"Found '{term}' in file: {filename} (size: {len(content)} characters)")
        except:
            pass
