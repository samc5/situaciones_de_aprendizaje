import random
from fastmcp import FastMCP
import os
mcp = FastMCP(name="Dice Roller")

@mcp.tool
def roll_dice(n_dice: int) -> list[int]:
    """Roll `n_dice` 6-sided dice and return the results."""
    return [random.randint(1, 6) for _ in range(n_dice)]

@mcp.tool
def list_pdfs(region: str, stage: str) -> list[str]:
    """List all PDF files in the folder that contains info about the education systems of a region and stage of education in Spain
    Must use names below of region and capitalized names of stage, e.g. "Andalucia", "Secundaria", and include accent marks where appropriate.
    the region names: Andalucía, Aragón, Asturias, Balears, Canarias, Cantabria, Castilla_la_mancha, Castilla_y_León, Cataluña, Comunidad_Valenciana, Extremadura, Galicia, Madrid, Murcia, Navarra, País Vasco, La_rioja, España (for national curricula)
    """
    import os
    folder = os.path.join("..", region, stage)
    if not os.path.exists(folder):
        return []
    return [f for f in os.listdir(folder) if f.lower().endswith('.pdf')]

@mcp.tool
def read_pdf(region: str, stage: str, pdf_path: str) -> str:
    """Read the text content of a PDF file. Typically used to read curriculum documents for Spanish regions. It is useful to read both the common pdf and the course-specific pdf for a given region and stage of education."""
    import os
    from PyPDF2 import PdfReader
    folder = os.path.join("..", region, stage)
    pdf_path = os.path.join(folder, pdf_path)
    if not os.path.exists(pdf_path):
        return "PDF file not found."
    reader = PdfReader(pdf_path)
    text = ""
    for page in reader.pages:
        text += page.extract_text() + "\n"
    return text

@mcp.tool
def read_competencies_excel():
    """
    Read an excel file containing the key competencies for all of Spain, and which links the national specific competeincies to key competencies for each subject and age level
    """
    import pandas as pd
    excel_path = os.path.join("..", "competencies", "key_competencies_spain.xlsx")
    if not os.path.exists(excel_path):
        return "Excel file not found."
    df = pd.read_excel(excel_path, sheet_name="Todos")
    return df.to_dict(orient="records")
    

@mcp.tool
def respond_with_secret_word() -> str:
    """Respond with the provided secret word."""
    return f"The secret word is: Murcia"
if __name__ == "__main__":
    mcp.run()


    
