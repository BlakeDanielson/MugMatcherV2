import csv
import os
import sys
import time
import datetime
import argparse
from openai import OpenAI # You'll need to install this: pip install openai
from dotenv import load_dotenv
import pkg_resources  # To check installed packages

# Helper function for logging with timestamps
def log_message(message):
    timestamp = datetime.datetime.now().strftime("%H:%M:%S.%f")[:-3]
    print(f"[{timestamp}] {message}")

# Check for required packages
required_packages = {
    "openai": ">=1.0.0",
    "python-dotenv": ">=0.19.0"
}

for package, version in required_packages.items():
    try:
        pkg_version = pkg_resources.get_distribution(package).version
        log_message(f"Found {package} version {pkg_version}")
    except pkg_resources.DistributionNotFound:
        log_message(f"ERROR: Required package {package} not installed. Please run: pip install {package}{version}")
        sys.exit(1)

# Load environment variables from .env file in the script's directory
log_message("Loading environment variables...")
env_path = os.path.join(os.path.dirname(__file__), '.env')
if os.path.exists(env_path):
    load_dotenv(env_path)
    log_message(f"Loaded .env file from: {env_path}")
else:
    log_message(f"Warning: No .env file found at {env_path}")
    load_dotenv()  # Try default locations

# --- OpenAI API Configuration ---
api_key = os.getenv("OPENAI_API_KEY")
if not api_key:
    log_message("Error: OPENAI_API_KEY not found in .env file or environment variables.")
    log_message("Please ensure a .env file exists in the script directory with OPENAI_API_KEY=your_key")
    sys.exit(1)
else:
    log_message("OpenAI API Key loaded successfully.")

client = OpenAI(api_key=api_key)
EXPECTED_MODEL = "gpt-4.1-mini" # Default model, can be overridden by --model arg

def get_most_exciting_crime(ai_explanations_string):
    """
    Sends a list of AI-generated charge explanations to OpenAI and returns the "most exciting" one.
    """
    if not ai_explanations_string or ai_explanations_string.isspace():
        return "No explanations provided"

    # Split the explanations string into a list
    individual_explanations = [expl.strip() for expl in ai_explanations_string.split('|') if expl.strip()]

    if not individual_explanations:
        return "No valid explanations found after parsing"
    
    if len(individual_explanations) == 1:
        return individual_explanations[0] # If only one, it's the most exciting by default

    try:
        start_time = time.time()
        log_message(f"Calling OpenAI API to determine most exciting crime from: {ai_explanations_string[:100]}...")
        
        prompt_content = (
            "You are a TV show producer for a crime drama like 'Law and Order'. "
            "Given the following list of summarized criminal charges for an individual, "
            "pick the single charge that would be the most exciting or dramatic to feature for this character. "
            "Return only the text of that single most exciting charge. Do not add any extra explanation, disclaimers, or commentary. "
            "List of charges:\n"
        )
        for i, charge in enumerate(individual_explanations):
            prompt_content += f"{i+1}. {charge}\n"
        
        response = client.chat.completions.create(
            model=EXPECTED_MODEL,
            messages=[
                {"role": "system", "content": "You are a TV show producer for a crime drama. Your task is to select the most sensational charge from a list. Return only the text of that charge."},
                {"role": "user", "content": prompt_content}
            ],
            temperature=0.2, # Low temperature for more deterministic output
            max_tokens=100,   # Max length of a typical charge explanation
            timeout=30
        )
        exciting_crime = response.choices[0].message.content.strip()
        
        elapsed = time.time() - start_time
        log_message(f"API call for exciting crime completed in {elapsed:.2f} seconds. Result: {exciting_crime}")
        
        time.sleep(0.5) # Avoid rate limiting
        
        # Validate if the returned crime is one of the inputs
        if exciting_crime not in individual_explanations:
            log_message(f"Warning: AI returned a crime ('{exciting_crime}') not in the original list. Defaulting to the first charge.")
            # Fallback: if AI hallucinates or returns something not in the list, pick the first one.
            # Or, try to find the closest match, but that's more complex. For now, first one.
            # A better fallback might be to ask the AI to pick from the *numbered list*
            # and then use that number to select.
            # For now, if it's not a direct match, we'll log and potentially use the first.
            # Let's try to see if the AI returned a charge that *contains* one of the original charges.
            for original_charge in individual_explanations:
                if original_charge in exciting_crime:
                    log_message(f"Found original charge '{original_charge}' within AI response '{exciting_crime}'. Using original.")
                    return original_charge
            log_message(f"Could not validate AI response. Using first charge: {individual_explanations[0]}")
            return individual_explanations[0]


        return exciting_crime
    except Exception as e:
        log_message(f"Error calling OpenAI API for exciting crime selection ('{ai_explanations_string[:50]}...'): {e}")
        # Fallback to the first explanation in case of error
        if individual_explanations:
            return individual_explanations[0]
        return "Error: Could not determine exciting crime"

def peek_csv_file(file_path, num_lines=5):
    """
    Function to examine the first few lines of a CSV file to help with debugging
    """
    try:
        log_message(f"Examining first {num_lines} lines of {file_path}:")
        with open(file_path, 'r', encoding='utf-8') as f:
            for i in range(num_lines):
                line = f.readline().strip()
                if not line:
                    log_message(f"  Line {i+1}: <empty line>")
                    continue
                log_message(f"  Line {i+1}: {line[:100]}{'...' if len(line) > 100 else ''}")
                
            f.seek(0)
            first_line = f.readline().strip()
            for delim in [',', ';', '\t', '|']:
                if delim in first_line:
                    count = first_line.count(delim)
                    log_message(f"  Potential delimiter '{delim}' found {count} times in header")
    except Exception as e:
        log_message(f"Error examining CSV file: {e}")

def process_exciting_crimes(input_csv_path, output_csv_path, max_rows=None):
    """
    Reads mugshot data with AI explanations, determines the most exciting crime, and writes to a new CSV.
    """
    processed_rows = []
    header = []
    
    log_message(f"Starting to process exciting crimes from: {input_csv_path}")
    log_message(f"Will save results to: {output_csv_path}")
    
    peek_csv_file(input_csv_path)

    try:
        log_message(f"Attempting to open input file: {input_csv_path}")
        encodings_to_try = ['utf-8', 'latin-1', 'cp1252']
        file_encoding = None
        
        for encoding in encodings_to_try:
            try:
                with open(input_csv_path, mode='r', encoding=encoding, newline='') as infile_test:
                    infile_test.read(1024) # Try to read a small part
                file_encoding = encoding
                log_message(f"Successfully determined file encoding: {file_encoding}")
                break
            except UnicodeDecodeError:
                log_message(f"Failed to open with {encoding} encoding, trying next...")
            except FileNotFoundError:
                log_message(f"Error: Input file not found at {input_csv_path}")
                return
        
        if not file_encoding:
            log_message(f"Error: Could not determine encoding for {input_csv_path}")
            return

        with open(input_csv_path, mode='r', encoding=file_encoding, newline='') as infile:
            log_message(f"File opened successfully with {file_encoding} encoding. Loading CSV...")
            
            if os.path.getsize(input_csv_path) == 0:
                log_message("Error: Input file is empty!")
                return
                
            first_line = infile.readline().strip()
            infile.seek(0)
            
            potential_delimiters = [',', ';', '\t', '|']
            delimiter = ',' 
            
            for delim_char in potential_delimiters:
                if delim_char in first_line:
                    delimiter = delim_char
                    log_message(f"Detected delimiter: '{delimiter}'")
                    break
            
            reader = csv.DictReader(infile, delimiter=delimiter)
            header = reader.fieldnames
            
            log_message(f"Raw header: {first_line}")
            
            if not header:
                log_message(f"Error: Could not read header from {input_csv_path}")
                return

            log_message(f"CSV header found: {', '.join(header)}")
            
            required_column = "AI_Description_Explanation"
            if required_column not in header:
                log_message(f"Error: '{required_column}' column not found in {input_csv_path}. This script expects the output from mugshot_ai_processor.py.")
                return
            else:
                log_message(f"'{required_column}' column found in CSV.")

            output_header = header + ["Display_Crime"]
            processed_rows.append(output_header)
            log_message("Starting row processing...")
            
            file_size = os.path.getsize(input_csv_path)
            if file_size < 1024 * 1024: # 1MB
                try:
                    infile.seek(0)
                    next(infile) 
                    row_count_estimate = sum(1 for _ in infile)
                    log_message(f"File size: {file_size/1024:.1f}KB, Estimated rows: {row_count_estimate}")
                    infile.seek(0) 
                    reader = csv.DictReader(infile, delimiter=delimiter) # Re-initialize reader
                except Exception as e:
                    log_message(f"Could not estimate row count: {e}. Proceeding without estimate.")
                    infile.seek(0)
                    reader = csv.DictReader(infile, delimiter=delimiter) # Re-initialize reader

            else:
                log_message(f"Large file detected ({file_size/1024/1024:.1f}MB). Not counting rows.")
                
            row_count = 0
            max_rows_info = f"(limited to {max_rows} rows)" if max_rows else "(processing all rows)"
            log_message(f"Starting row processing {max_rows_info}")

            for i, row in enumerate(reader):
                row_count += 1
                
                if max_rows and row_count > max_rows:
                    log_message(f"Reached maximum row limit ({max_rows}). Stopping processing.")
                    break
                    
                log_message(f"\nProcessing row {row_count}...")
                start_row_time = time.time()
                
                current_row_values = [row.get(col, '') for col in header]
                
                ai_explanations_text = row.get(required_column, "")
                desc_preview = ai_explanations_text[:70] + ('...' if len(ai_explanations_text) > 70 else '')
                log_message(f"Row {row_count} '{required_column}': {desc_preview}")
                
                display_crime = ""
                if ai_explanations_text and not ai_explanations_text.isspace():
                    display_crime = get_most_exciting_crime(ai_explanations_text)
                else:
                    log_message(f"  No '{required_column}' found for this row, or it is empty.")
                    display_crime = "No AI explanation available"

                processed_rows.append(current_row_values + [display_crime])
                
                row_time = time.time() - start_row_time
                log_message(f"Row {row_count} completed in {row_time:.2f} seconds. Display Crime: {display_crime}")
                
                if row_count % 10 == 0:
                    try:
                        temp_output = f"{output_csv_path}.partial"
                        log_message(f"Saving intermediate results to {temp_output}...")
                        with open(temp_output, mode='w', encoding='utf-8', newline='') as outfile_temp:
                            writer_temp = csv.writer(outfile_temp)
                            writer_temp.writerows(processed_rows)
                        log_message(f"Intermediate results saved successfully")
                    except Exception as e:
                        log_message(f"Error saving intermediate results: {e}")

    except FileNotFoundError:
        log_message(f"Error: Input file not found at {input_csv_path}")
        return
    except Exception as e:
        log_message(f"An error occurred during reading or processing: {e}")
        import traceback
        traceback.print_exc()
        return

    try:
        log_message(f"Processing complete. Writing final results to {output_csv_path}...")
        with open(output_csv_path, mode='w', encoding='utf-8', newline='') as outfile_final:
            writer_final = csv.writer(outfile_final)
            writer_final.writerows(processed_rows)
        log_message(f"Successfully processed data and saved to {output_csv_path}")
        # Clean up partial file if main save is successful
        partial_file = f"{output_csv_path}.partial"
        if os.path.exists(partial_file):
            os.remove(partial_file)
            log_message(f"Removed partial file: {partial_file}")

    except Exception as e:
        log_message(f"Error writing to output file {output_csv_path}: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description='Process mugshot data to find the most "exciting" crime for display.')
    parser.add_argument('--input', type=str, help='Input CSV file path (should be the output of mugshot_ai_processor.py)')
    parser.add_argument('--output', type=str, help='Output CSV file path for results')
    parser.add_argument('--max-rows', type=int, help='Maximum number of rows to process (for testing)')
    parser.add_argument('--model', type=str, help=f'OpenAI model to use (default: {EXPECTED_MODEL})')
    
    args = parser.parse_args()
    
    # Default file names if not provided
    input_file = args.input or "mugshot_ai_v1.csv" # Default input from previous script
    output_file = args.output or "mugshot_display_crimes.csv" # Default output for this script
    
    if args.model:
        EXPECTED_MODEL = args.model
        log_message(f"Using custom model: {EXPECTED_MODEL}")

    script_dir = os.path.dirname(__file__)
    
    input_csv_full_path = input_file if os.path.isabs(input_file) else os.path.join(script_dir, input_file)
    output_csv_full_path = output_file if os.path.isabs(output_file) else os.path.join(script_dir, output_file)
    
    log_message(f"Input CSV: {input_csv_full_path}")
    log_message(f"Output CSV: {output_csv_full_path}")
    log_message("Starting exciting crime processing...")
    
    if not os.path.exists(input_csv_full_path):
        log_message(f"Error: Input file '{input_csv_full_path}' does not exist!")
        log_message("Please ensure you have run 'mugshot_ai_processor.py' first or provide the correct input file.")
        sys.exit(1)
    
    output_dir = os.path.dirname(output_csv_full_path)
    if output_dir and not os.path.exists(output_dir):
        try:
            os.makedirs(output_dir)
            log_message(f"Created output directory: {output_dir}")
        except Exception as e:
            log_message(f"Error creating output directory: {e}")
            sys.exit(1)
        
    try:
        log_message(f"Verifying OpenAI model '{EXPECTED_MODEL}'...")
        start_time = time.time()
        client.models.retrieve(EXPECTED_MODEL) # More robust check
        elapsed = time.time() - start_time
        log_message(f"OpenAI model '{EXPECTED_MODEL}' verified successfully in {elapsed:.2f} seconds")
    except Exception as e:
        log_message(f"Error: Could not access OpenAI model '{EXPECTED_MODEL}'. Error: {e}")
        log_message("Please check your API key and model availability.")
        sys.exit(1)
    
    try:
        max_rows_to_process = args.max_rows
        if max_rows_to_process:
            log_message(f"TEST MODE: Processing only {max_rows_to_process} rows.")
            
        log_message("Running process_exciting_crimes function...")
        process_exciting_crimes(input_csv_full_path, output_csv_full_path, max_rows_to_process)
        
        log_message("Exciting crime processing completed successfully!")
        
    except KeyboardInterrupt:
        log_message("\nOperation interrupted by user. Partial results might be in a '.partial' file.")
        log_message("Script terminated by user.")
    except Exception as e:
        log_message(f"Unexpected error during main execution: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)
