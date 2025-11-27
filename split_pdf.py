import sys
import os
import json
from PyPDF2 import PdfReader, PdfWriter

def extract_pages(pdf_path, start_page, end_page, output_path):
    """Extract pages from start_page to end_page (1-based) into output_path."""
    reader = PdfReader(pdf_path)
    writer = PdfWriter()
    for p in range(start_page - 1, end_page):  # Convert 1-based to 0-based
        if 0 <= p < len(reader.pages):
            writer.add_page(reader.pages[p])
    with open(output_path, "wb") as f:
        writer.write(f)

def safe_filename(name):
    """Sanitize filename to remove unsafe characters."""
    return "".join(c if c.isalnum() or c in "._- " else "_" for c in name)

def find_pdf_and_json(folder):
    pdf_file = None
    json_file = None
    for f in os.listdir(folder):
        if f.lower().endswith(".pdf"):
            pdf_file = os.path.join(folder, f)
        elif f.lower().endswith(".json"):
            json_file = os.path.join(folder, f)
    if not pdf_file or not json_file:
        print("Error: Folder must contain one PDF and one JSON file.")
        sys.exit(1)
    return pdf_file, json_file

def main():
    if len(sys.argv) < 2:
        print("Usage: python split_pdf.py <folder> OR python split_pdf.py <pdf> <json>")
        sys.exit(1)
    folder = None
    if os.path.isdir(sys.argv[1]):
        folder = sys.argv[1]
        pdf_path, json_path = find_pdf_and_json(folder)
    elif len(sys.argv) >= 3:
        pdf_path = sys.argv[1]
        json_path = sys.argv[2]
    else:
        print("Error: You must provide either a folder or both PDF and JSON paths.")
        sys.exit(1)

    if not os.path.exists(pdf_path):
        print(f"Error: PDF not found: {pdf_path}")
        sys.exit(1)
    if not os.path.exists(json_path):
        print(f"Error: JSON not found: {json_path}")
        sys.exit(1)

    with open(json_path, "r", encoding="utf-8") as f:
        data = json.load(f)

    offset = data.get("offset", 0)
    # Region is second to last part of the path in folder, stage is last part / extract from here
    if folder:
        region = folder.split(os.sep)[-2]
        stage = folder.split(os.sep)[-1]
    else:
        region = pdf_path.split(os.sep)[-3]
        stage = pdf_path.split(os.sep)[-2]

    base_dir = os.path.dirname(os.path.abspath(pdf_path))
    output_dir = os.path.join(base_dir)
    os.makedirs(output_dir, exist_ok=True)

    reader = PdfReader(pdf_path)
    total_pages = len(reader.pages)

    # Process materias
    if "materias" in data and data["materias"]:
        materias = data["materias"]
        
        # Find first and last materia pages
        first_materia_start = min(
            min(m["start_page_pre_offset"], m["start_page_post_offset"]) 
            for m in materias
        )
        last_materia_end = max(
            min(m["end_page_pre_offset"], m["end_page_post_offset"]) 
            for m in materias
        )

        # Save common pages (before first materia and after last materia)
        common_filename = f"{safe_filename(region)}_{safe_filename(stage)}_common.pdf"
        common_path = os.path.join(output_dir, common_filename)
        writer = PdfWriter()
        
        # Pages before first materia (1 to first_materia_start - 1)
        for p in range(0, first_materia_start - 1):
            if 0 <= p < total_pages:
                writer.add_page(reader.pages[p])
                
        
        # Pages after last materia (last_materia_end to end)
        for p in range(last_materia_end, total_pages):
            if 0 <= p < total_pages:
                writer.add_page(reader.pages[p])
        
        with open(common_path, "wb") as f:
            writer.write(f)
        print(f"Generated: {common_path}")

        # Save individual materia PDFs
        for materia in materias:
            start_page = min(materia["start_page_pre_offset"], materia["start_page_post_offset"])
            end_page = min(materia["end_page_pre_offset"], materia["end_page_post_offset"])
            
            titulo = materia.get("titulo", "materia")
            filename = f"{safe_filename(region)}_{safe_filename(stage)}_{safe_filename(titulo)}.pdf"
            output_path = os.path.join(output_dir, filename)
            
            extract_pages(pdf_path, start_page, end_page, output_path)
            print(f"Generated: {output_path}")

    print(f"All files saved in: {output_dir}")

if __name__ == "__main__":
    main()