import os
import time
import pathlib
import google.generativeai as genai
from pydantic import BaseModel, Field, ValidationError
from typing import List
from dotenv import load_dotenv
import sys

load_dotenv()

# --- SCRIPT CONFIGURATION ---
if len(sys.argv) > 1:
    if os.path.isfile(sys.argv[1]):
        INPUT_PDF_FILE = sys.argv[1]
    else:
        print(f"Error: '{sys.argv[1]}' is not a valid file.")
        sys.exit(1)
else:
    print("Usage: python extract_toc.py <path_to_pdf_file>")
    sys.exit(1)

# Use a powerful model with a large context window for long PDF documents.
GEMINI_MODEL = 'gemini-flash-latest'

"""
This script processes a single PDF curriculum document, extracts the table
of contents with page numbers using the Google Gemini API, and saves the
output as a JSON file in the same directory as the input PDF.

To run this script:
1. Make sure you have the necessary libraries installed:
   pip install "google-generativeai>=0.5.0" pydantic python-dotenv
2. Set your Google API Key as an environment variable or in a .env file:
   - For Mac/Linux: export GOOGLE_API_KEY="your_api_key"
   - For Windows: set GOOGLE_API_KEY="your_api_key"
   - Or create a .env file with: GOOGLE_API_KEY=your_api_key
3. Run the script from your terminal:
   python extract_toc.py path/to/your/curriculum.pdf
"""

# --- PYDANTIC MODELS FOR STRUCTURED OUTPUT ---

class SeccionDiseno(BaseModel):
    start_page_pre_offset: int = Field(description="Start page number as printed in the document (OCR)")
    start_page_post_offset: int = Field(description="Start page number in the actual PDF file (with offset applied)")
    end_page_pre_offset: int = Field(description="End page number as printed in the document (OCR)")
    end_page_post_offset: int = Field(description="End page number in the actual PDF file (with offset applied)")
    anexo_nombre: str = Field(description="Optional name or description of this section")

class CompetenciasClaves(BaseModel):
    start_page_pre_offset: int = Field(description="Start page number as printed in the document (OCR)")
    start_page_post_offset: int = Field(description="Start page number in the actual PDF file (with offset applied)")
    end_page_pre_offset: int = Field(description="End page number as printed in the document (OCR)")
    end_page_post_offset: int = Field(description="End page number in the actual PDF file (with offset applied)")
    anexo_nombre: str = Field(description="Name or description of the competencias claves section")

class Materia(BaseModel):
    titulo: str = Field(description="The title/name of the materia (subject)")
    start_page_pre_offset: int = Field(description="Start page number as printed in the document (OCR)")
    start_page_post_offset: int = Field(description="Start page number in the actual PDF file (with offset applied)")
    end_page_pre_offset: int = Field(description="End page number as printed in the document (OCR)")
    end_page_post_offset: int = Field(description="End page number in the actual PDF file (with offset applied)")

class TableOfContents(BaseModel):
    lista_materias: List[str] = Field(description="List of names of all materias/courses in the document")
    offset: int = Field(description="The offset between printed page numbers and actual PDF page numbers")
    seccion_diseno: List[SeccionDiseno] = Field(description="Sections about diseño de situaciones de aprendizaje")
    competencias_claves: CompetenciasClaves = Field(description="Section about competencias claves")
    materias: List[Materia] = Field(description="List of all materias with their page ranges")

# --- SYSTEM PROMPT ---
SYSTEM_PROMPT = """
You are an expert curriculum designer for the Spanish government. Your goal is going to be extracting critical information from documents regarding each level of schooling in each Autonomous Community, so that a teacher looking to adjust their "situación de aprendizaje" can "translate" it between regions, or a general outline/idea can be turned into a situación for a specific region.

Your job right now is to go through the given PDF file and form a table of contents including the start and end page numbers of each section. Keep in mind that the page numbers you receive through OCR are the printed page numbers in the document which may not start at 1. You should first figure out the offset in page numbers and store that. Then for each section you include, I want the page number as per the OCR (the printed number), and then the number in the actual PDF file (that's the offset number). For the materias, the next segment should start on the same page the last page ends.

Please include:
- A list of all courses and/or materias that appear in the text. This is so that later when you list out the page numbers of each materia you don't miss any. Different course titles for the same materia should be separated (e.g. if they are for different years)
- The section about diseño de situaciones de aprendizaje - this part should specifically list out the sections that should be included in situaciones de aprendizaje. This may or may not include an example of a situacion de aprendizaje as well. You may include multiple sections of this type if that better expresses the instructions, but don't include anything that is not directly related to a situacion de aprendizaje
- The section about competencias claves
- Each individual materia (subject). You must make the start page the page where the heading of the materia appears, and the end page the page where the heading of the next one appears.
"""

# --- SCHEMA CLEANING FUNCTION ---
def get_gemini_compatible_schema(pydantic_model: type[BaseModel]) -> dict:
    """
    Generates a JSON schema from a Pydantic model and cleans it to be
    compatible with the Gemini API by:
    1. Flattening it (removing '$defs' and resolving '$ref').
    2. Recursively removing all 'title' fields.
    """
    # Step 1: Generate the standard schema
    schema = pydantic_model.model_json_schema()

    # Step 2: Flatten the schema (remove $defs) if present
    if '$defs' in schema:
        defs = schema.pop('$defs')
        def resolve_refs(obj):
            if isinstance(obj, dict):
                if '$ref' in obj:
                    ref_key = obj['$ref'].split('/')[-1]
                    return resolve_refs(defs[ref_key].copy())
                else:
                    return {k: resolve_refs(v) for k, v in obj.items()}
            elif isinstance(obj, list):
                return [resolve_refs(item) for item in obj]
            else:
                return obj
        schema = resolve_refs(schema)

    # Step 3: Remove all 'title' keys recursively
    def remove_titles_recursive(obj):
        if isinstance(obj, dict):
            obj.pop('title', None)
            for value in obj.values():
                remove_titles_recursive(value)
        elif isinstance(obj, list):
            for item in obj:
                remove_titles_recursive(item)
        return obj

    return remove_titles_recursive(schema)

# --- MAIN PROCESSING FUNCTION ---
def process_pdf_for_toc(pdf_file_path: str):
    """
    Process a single PDF file to extract table of contents with page numbers.
    """
    # Configure the Gemini client
    try:
        api_key = os.getenv("GOOGLE_API_KEY")
        if not api_key:
            raise ValueError("GOOGLE_API_KEY environment variable not set.")
        genai.configure(api_key=api_key)
    except Exception as e:
        print(f"Error configuring API: {e}")
        return

    pdf_path = pathlib.Path(pdf_file_path)
    
    if not pdf_path.exists():
        print(f"Error: File '{pdf_file_path}' does not exist.")
        return
    
    if pdf_path.suffix.lower() != '.pdf':
        print(f"Error: File '{pdf_file_path}' is not a PDF file.")
        return

    print(f"Processing PDF: {pdf_path.name}")
    
    # Initialize the generative model
    model = genai.GenerativeModel(GEMINI_MODEL)
    
    uploaded_file = None
    try:
        # Upload the file to the Gemini API
        print("1. Uploading file to Google AI...")
        uploaded_file = genai.upload_file(path=pdf_path, display_name=pdf_path.name)
        print(f"   ... Upload successful. File name: {uploaded_file.name}")

        # Generate a clean, API-compatible schema
        print("2. Generating Gemini-compatible JSON schema...")
        compatible_schema = get_gemini_compatible_schema(TableOfContents)
        
        # Define the generation configuration for structured output
        generation_config = genai.GenerationConfig(
            response_mime_type="application/json",
            response_schema=compatible_schema,
        )
        
        # Formulate the prompt with the system instructions and the file
        prompt_parts = [SYSTEM_PROMPT, uploaded_file]

        # Call the API to generate the content
        print("3. Calling Gemini API to extract table of contents...")
        response = model.generate_content(
            prompt_parts, 
            generation_config=generation_config
        )
        print("   ... API call complete.")

        # Validate the JSON response with the Pydantic model
        print("4. Validating the structured response...")
        toc_data = TableOfContents.model_validate_json(response.text)
        print("   ... Validation successful.")

        # Save the validated data to a JSON file in the same directory as the PDF
        output_filename = pdf_path.parent / f"{pdf_path.stem}_toc.json"
        with open(output_filename, "w", encoding="utf-8") as f:
            f.write(toc_data.model_dump_json(indent=2, ensure_ascii=False))
        
        print(f"5. Successfully saved table of contents to '{output_filename}'")
        
        # Print summary
        print("\n--- Summary ---")
        print(f"Total materias found: {len(toc_data.lista_materias)}")
        print(f"Page offset: {toc_data.offset}")
        print(f"Diseño sections: {len(toc_data.seccion_diseno)}")
        print(f"Materias with page numbers: {len(toc_data.materias)}")

    except ValidationError as e:
        print(f"ERROR: Pydantic validation failed for {pdf_path.name}.")
        print("The model's output did not match the required JSON structure.")
        print(e)
        if 'response' in locals() and hasattr(response, 'text'):
            error_filename = pdf_path.parent / f"{pdf_path.stem}_toc_error.json"
            error_filename.write_text(response.text, encoding='utf-8')
            print(f"   ... Raw model output saved to '{error_filename}' for debugging.")

    except Exception as e:
        print(f"An unexpected error occurred while processing {pdf_path.name}: {e}")

    finally:
        # Clean up the uploaded file
        if uploaded_file:
            try:
                print(f"6. Cleaning up uploaded file: {uploaded_file.name}")
                genai.delete_file(uploaded_file.name)
            except Exception as e:
                print(f"   ... Warning: Could not delete uploaded file {uploaded_file.name}. Error: {e}")


if __name__ == "__main__":
    process_pdf_for_toc(INPUT_PDF_FILE)
    print("\n--- Processing complete. ---")