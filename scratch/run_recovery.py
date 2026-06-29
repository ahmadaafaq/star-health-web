import json
import re

LOG_PATH = "/Users/apple/.gemini/antigravity-ide/brain/6ef877bd-c946-4e1c-9b70-1ab83097a494/.system_generated/logs/transcript.jsonl"

best_step = None
best_content = ""
max_lines = 0

with open(LOG_PATH, 'r', encoding='utf-8') as f:
    for line_idx, line in enumerate(f):
        try:
            step = json.loads(line)
            # We want to check both the step content and the tool results
            # The VIEW_FILE tool outputs are recorded in the step representation
            
            # Let's search inside the whole step dictionary for AIAdvisor.tsx content
            content_str = json.dumps(step)
            if "AIAdvisor.tsx" in content_str:
                # Let's find view_file output
                # Let's look for output field in any tool response or step content
                output_candidates = []
                
                # Check standard tool output structures
                if "output" in step:
                    output_candidates.append(step["output"])
                
                # Check inside tool_calls or response structure
                if "response" in step:
                    output_candidates.append(str(step["response"]))
                
                # Recursively extract any string containing typical view_file headers
                def find_strings(val):
                    res = []
                    if isinstance(val, str):
                        if "modified to include a line number" in val or "Showing lines" in val:
                            res.append(val)
                    elif isinstance(val, dict):
                        for k, v in val.items():
                            res.extend(find_strings(v))
                    elif isinstance(val, list):
                        for item in val:
                            res.extend(find_strings(item))
                    return res
                
                output_candidates.extend(find_strings(step))
                
                for candidate in output_candidates:
                    lines_count = candidate.count("\n")
                    if lines_count > max_lines:
                        max_lines = lines_count
                        best_step = step.get("step_index", line_idx)
                        best_content = candidate
        except Exception as e:
            pass

print(f"Best step found: {best_step} with {max_lines} lines of output")

if best_content:
    lines = best_content.split("\n")
    original_lines = []
    header_passed = False
    
    for line in lines:
        if not header_passed:
            if "original_line" in line or "original code should remove the line number" in line:
                header_passed = True
                continue
            if line.startswith("Showing lines") or line.startswith("The following code has been modified") or line.startswith("Created At") or line.startswith("File Path") or line.startswith("Total Lines") or line.startswith("Completed At"):
                continue
            # If we don't see the header marker but see line prefix, start parsing anyway
            if re.match(r"^\d+:", line):
                header_passed = True
        
        if header_passed:
            # Check if it is the footer warning or end of file
            if line.startswith("The above content shows the entire") or line.startswith("The above content does NOT show"):
                continue
            match = re.match(r"^\s*(\d+):\s(.*)$", line)
            if match:
                original_lines.append(match.group(2))
            else:
                # Sometimes a line doesn't match if it's empty or doesn't have prefix, but usually it does
                # Let's see if we should just keep it as is or if it's missing the line number
                if line.strip() == "":
                    original_lines.append("")
                else:
                    # Try a simpler regex that just strips leading numbers and colon
                    match2 = re.match(r"^\s*\d+:(.*)$", line)
                    if match2:
                        original_lines.append(match2.group(1))
                    else:
                        original_lines.append(line)

    output_path = "scratch/recovered_advisor_complete.tsx"
    with open(output_path, "w", encoding="utf-8") as out:
        out.write("\n".join(original_lines))
    print(f"Successfully recovered {len(original_lines)} lines to {output_path}")
else:
    print("Could not find any AIAdvisor.tsx content in logs.")
