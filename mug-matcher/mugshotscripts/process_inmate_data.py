import pandas as pd
from openai import OpenAI
import os
import csv
from dotenv import load_dotenv
import time
import datetime
import argparse
import sys
import pkg_resources

# Helper function for logging with timestamps
def log_message(message):
    timestamp = datetime.datetime.now().strftime("%H:%M:%S.%f")[:-3]
    print(f"[{timestamp}] {message}")

# Check for required packages
required_packages = {
    "openai": ">=1.0.0",
    "python-dotenv": ">=0.19.0",
    "pandas": ">=1.0.0"
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
    log_message(f"Warning: No .env file found at {env_path}. Attempting to load from default locations.")
    load_dotenv()

# --- OpenAI API Configuration ---
api_key = os.getenv("OPENAI_API_KEY")
if not api_key:
    log_message("Error: OPENAI_API_KEY not found in .env file or environment variables.")
    log_message("Please ensure a .env file exists in the script directory or an environment variable is set with OPENAI_API_KEY=your_key")
    sys.exit(1)
else:
    log_message("OpenAI API Key loaded successfully.")

client = OpenAI(api_key=api_key)
DEFAULT_MODEL = "gpt-4.1-mini"
current_model = DEFAULT_MODEL

def call_openai_api(messages, max_tokens=150, temperature=0.2, timeout=30):
    """Helper function to call OpenAI API with error handling and retries."""
    global current_model
    retries = 3
    for attempt in range(retries):
        try:
            log_message(f"Calling OpenAI API (model: {current_model}, attempt {attempt+1}/{retries})...")
            start_time = time.time()
            response = client.chat.completions.create(
                model=current_model,
                messages=messages,
                max_tokens=max_tokens,
                temperature=temperature,
                timeout=timeout
            )
            elapsed = time.time() - start_time
            log_message(f"API call successful in {elapsed:.2f} seconds.")
            return response.choices[0].message.content.strip()
        except Exception as e:
            log_message(f"OpenAI API error (attempt {attempt+1}/{retries}): {str(e)}")
            if attempt < retries - 1:
                time.sleep(2 ** attempt) # Exponential backoff
            else:
                log_message("Max retries reached. API call failed.")
                return f"Error: API call failed after {retries} attempts."

def identify_most_interesting_raw_charge(raw_description_string):
    """
    Identifies the most interesting charge from a pipe-separated string of raw charge descriptions.
    """
    if not raw_description_string or raw_description_string.isspace():
        return "No raw charges provided"

    charges = [charge.strip() for charge in raw_description_string.split('|') if charge.strip()]
    if not charges:
        return "No valid charges found after parsing"
    
    if len(charges) == 1:
        return charges[0]

    charge_list_str = "\n".join([f"{i+1}. {charge}" for i, charge in enumerate(charges)])
    
    system_prompt = "You are an assistant that analyzes criminal charge descriptions. Given a list of charge descriptions for an individual, identify and return only the text of the single most interesting, unusual, or serious charge. Do not add any extra explanation, disclaimers, or commentary."
    user_prompt = f"From the following list of charge descriptions, select and return the text of the single most interesting, unusual, or serious one:\n{charge_list_str}"

    messages = [
        {"role": "system", "content": system_prompt},
        {"role": "user", "content": user_prompt}
    ]
    
    selected_charge = call_openai_api(messages, max_tokens=200) # Increased max_tokens for potentially long charge descriptions

    if selected_charge.startswith("Error:") or selected_charge not in charges:
         # Fallback: if AI fails or returns something not in the list, pick the first one.
        log_message(f"AI selection error or invalid response ('{selected_charge}'). Defaulting to the first charge.")
        return charges[0]
    return selected_charge


def reword_single_charge(charge_text):
    """
    Rewords a single charge description into plain English.
    """
    if not charge_text or charge_text.isspace() or charge_text.startswith("Error:") or charge_text == "No raw charges provided" or charge_text == "No valid charges found after parsing":
        return "Cannot reword invalid/empty charge"

    messages = [
        {"role": "system", "content": "You are a helpful assistant that rewrites legal charge descriptions into plain, concise English suitable for an average person to understand. Aim for clarity and brevity, ideally under 15 words. Return only the rephrased charge description. For example, 'UTTERING FORGED INSTRUMENT' could be 'Using a fake document'. 'FAILURE TO APPEAR - MISDEMEANOR' could be 'Missed court for a minor offense'."},
        {"role": "user", "content": f"Rewrite this charge description in plain English: \"{{{charge_text}}}\""}
    ]
    
    return call_openai_api(messages, max_tokens=60, temperature=0.1)


def main():
    global current_model
    parser = argparse.ArgumentParser(description='Sorts inmate data, identifies the most interesting charge using AI, rewrites it in plain English, and adds it as a new column.')
    parser.add_argument('--input', type=str, default='mugshots_data.csv', help='Input CSV file path (default: mugshots_data.csv from scrape.py).')
    parser.add_argument('--output', type=str, default='processed_inmate_charges.csv', help='Output CSV file path (default: processed_inmate_charges.csv).')
    parser.add_argument('--max-rows', type=int, help='Maximum number of rows to process (for testing).')
    parser.add_argument('--model', type=str, default=DEFAULT_MODEL, help=f'OpenAI model to use (default: {DEFAULT_MODEL}).')
    
    args = parser.parse_args()
    current_model = args.model

    script_dir = os.path.dirname(__file__)
    input_csv_path = args.input if os.path.isabs(args.input) else os.path.join(script_dir, args.input)
    output_csv_path = args.output if os.path.isabs(args.output) else os.path.join(script_dir, args.output)

    log_message(f"Input CSV: {input_csv_path}")
    log_message(f"Output CSV: {output_csv_path}")
    log_message(f"Using OpenAI model: {current_model}")

    if not os.path.exists(input_csv_path):
        log_message(f"Error: Input file '{input_csv_path}' does not exist!")
        sys.exit(1)
    
    output_dir = os.path.dirname(output_csv_path)
    if output_dir and not os.path.exists(output_dir):
        try:
            os.makedirs(output_dir)
            log_message(f"Created output directory: {output_dir}")
        except Exception as e:
            log_message(f"Error creating output directory '{output_dir}': {e}")
            sys.exit(1)

    try:
        log_message(f"Verifying OpenAI model '{current_model}'...")
        client.models.retrieve(current_model)
        log_message(f"OpenAI model '{current_model}' verified successfully.")
    except Exception as e:
        log_message(f"Error: Could not access OpenAI model '{current_model}'. Error: {e}")
        log_message("Please check your API key, organization ID (if applicable), and model availability.")
        sys.exit(1)

    try:
        log_message(f"Reading CSV file: {input_csv_path}")
        # Detect delimiter by peeking at the first line
        with open(input_csv_path, 'r', encoding='utf-8') as f_peek:
            first_line = f_peek.readline()
            dialect = csv.Sniffer().sniff(first_line, delimiters=[',',';','\\t','|'])
            delimiter = dialect.delimiter
            log_message(f"Detected delimiter: '{delimiter}'")
        
        df = pd.read_csv(input_csv_path, delimiter=delimiter, on_bad_lines='skip')
        log_message(f"Successfully read {len(df)} rows from {input_csv_path}.")

        if 'InmateID' not in df.columns:
            log_message("Error: 'InmateID' column not found in input CSV. Cannot sort.")
            sys.exit(1)
        if 'Description' not in df.columns:
            log_message("Error: 'Description' column (for raw charges) not found in input CSV.")
            sys.exit(1)

        log_message("Sorting data by 'InmateID'...")
        df['InmateID'] = pd.to_numeric(df['InmateID'], errors='coerce')
        df.dropna(subset=['InmateID'], inplace=True) # Remove rows where InmateID couldn't be converted
        df['InmateID'] = df['InmateID'].astype(int)
        df.sort_values(by='InmateID', inplace=True)
        log_message("Data sorted successfully.")

        output_column_name = 'Interesting_Charge_Plain_English'
        df[output_column_name] = None # Initialize new column

        rows_to_process = len(df)
        if args.max_rows and args.max_rows < rows_to_process:
            df = df.head(args.max_rows)
            rows_to_process = args.max_rows
            log_message(f"Processing a maximum of {args.max_rows} rows.")
        
        log_message(f"Starting processing of {rows_to_process} inmates...")
        
        # Using .iterrows() is not the most performant for pandas, but given the API calls,
        # the iteration overhead is minor compared to network latency.
        # For very large datasets without external calls, df.apply() would be better.
        for index, row in df.iterrows():
            log_message(f"Processing inmate {index + 1}/{rows_to_process}, ID: {row.get('InmateID', 'N/A')}, Name: {row.get('Name', 'N/A')}")
            
            raw_charges = row.get('Description', '')
            
            if pd.isna(raw_charges) or not raw_charges.strip():
                log_message("  No raw charges found for this inmate. Skipping AI processing.")
                df.loc[index, output_column_name] = "No raw charges listed"
                continue

            log_message(f'  Identifying most interesting charge from: "{str(raw_charges)[:100]}..."')
            interesting_charge_raw = identify_most_interesting_raw_charge(str(raw_charges))
            log_message(f'  Identified raw interesting charge: "{interesting_charge_raw}"')
            
            plain_english_charge = reword_single_charge(interesting_charge_raw)
            log_message(f'  Reworded to plain English: "{plain_english_charge}"')
            
            df.loc[index, output_column_name] = plain_english_charge
            
            time.sleep(1.5) # Respect API rate limits

            if (index + 1) % 10 == 0:
                log_message(f"Processed {index + 1} inmates. Saving intermediate progress...")
                try:
                    df.to_csv(output_csv_path, index=False, quoting=csv.QUOTE_ALL)
                    log_message(f"Intermediate progress saved to {output_csv_path}")
                except Exception as e_save:
                    log_message(f"Error saving intermediate progress: {e_save}")


        log_message("Processing complete.")
        df.to_csv(output_csv_path, index=False, quoting=csv.QUOTE_ALL)
        log_message(f"Results saved to {output_csv_path}")

    except FileNotFoundError:
        log_message(f"Error: Input file not found. Path: {input_csv_path}")
    except pd.errors.EmptyDataError:
        log_message(f"Error: Input file {input_csv_path} is empty or not valid CSV.")
    except Exception as e:
        log_message(f"An unexpected error occurred: {str(e)}")
        import traceback
        traceback.print_exc()
    finally:
        log_message("Script finished.")

if __name__ == "__main__":
    main() 