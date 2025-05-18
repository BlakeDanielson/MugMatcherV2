## Current Objective: Develop `mugshot_exciting_crime_processor.py`

**Context:**
The user has requested a new Python script, `mugshot_exciting_crime_processor.py`, to enhance the data processing pipeline. This script will take the output from `mugshot_ai_processor.py` (specifically the "AI_Description_Explanation" column), and use AI to determine the single "most exciting" crime from potentially multiple charges. This "most exciting" crime will be saved in a new "Display_Crime" column in a new output CSV.

This task takes precedence over the previously planned "Define Visual Design System."

**Previous Actions:**
1.  Successfully read `projectRoadmap.md`, `currentTask.md`, `techStack.md`, and `codebaseSummary.md`.
2.  Created the initial version of `mug-matcher/mugshotscripts/mugshot_exciting_crime_processor.py` based on `mugshot_ai_processor.py` and the user's requirements.

**Next Steps:**
1.  Update `cline_docs/projectRoadmap.md` to include this new script development task.
2.  Update `cline_docs/codebaseSummary.md` to reflect the addition of the new script and its role.
3.  Test the `mugshot_exciting_crime_processor.py` script. This will likely involve:
    *   Ensuring a sample input CSV (e.g., `mugshot_ai_v1.csv`) is available.
    *   Running the script: `python mug-matcher/mugshotscripts/mugshot_exciting_crime_processor.py --input mugshot_ai_v1.csv --output mugshot_display_crimes.csv`
    *   Reviewing the output CSV (`mugshot_display_crimes.csv`) for correctness.
    *   Checking logs for any errors or warnings.
4.  Refine `mugshot_exciting_crime_processor.py` based on testing, particularly the AI prompting and fallback logic for selecting the "most exciting" crime.
5.  Inform the user about the script's completion and provide instructions on how to run it.
