from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import subprocess
import json
import os
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="Lesson Plan Generator API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class GenerateRequest(BaseModel):
    region: str
    stage: str
    topic: str

class GenerateResponse(BaseModel):
    data: dict

@app.get("/")
async def root():
    return {"message": "Lesson Plan Generator API", "status": "running"}

@app.post("/api/generate", response_model=GenerateResponse)
async def generate_lesson(request: GenerateRequest):
    """
    Generate a lesson plan using the Python script.
    """
    logger.info(f"Generate request: region={request.region}, stage={request.stage}, topic={request.topic}")
    
    try:
        # Path to your Python script
        script_path = os.path.join(
            os.path.dirname(__file__), 
            "..", 
            "gemini_fastmcp", 
            "gem.py"
        )
        
        # Resolve to absolute path
        script_path = os.path.abspath(script_path)
        logger.info(f"Script path: {script_path}")
        
        # Check if script exists
        if not os.path.exists(script_path):
            logger.error(f"Script not found at: {script_path}")
            raise HTTPException(
                status_code=500,
                detail=f"Python script not found at: {script_path}"
            )
        
        # Execute the Python script with arguments
        logger.info(f"Executing script with args: {request.region}, {request.stage}, {request.topic}")
        
        result = subprocess.run(
            [
                "python3", 
                script_path,
                request.region,
                request.stage,
                request.topic
            ],
            capture_output=True,
            text=True,
            timeout=200,
            cwd=os.path.dirname(script_path)  # Set working directory
        )
        
        # Log the output
        logger.info(f"Script return code: {result.returncode}")
        logger.info(f"Script stdout: {result.stdout[:500]}")  # First 500 chars
        if result.stderr:
            logger.error(f"Script stderr: {result.stderr}")
        
        # Check if execution was successful
        if result.returncode != 0:
            raise HTTPException(
                status_code=500,
                detail=f"Script execution failed: {result.stderr or 'Unknown error'}"
            )
        
        # Parse JSON output
        try:
            cleaned_output = clean_response(result.stdout)
            lesson_data = json.loads(cleaned_output)
            logger.info("Successfully parsed JSON output")
        except json.JSONDecodeError as e:
            logger.error(f"JSON decode error: {str(e)}")
            logger.error(f"Raw output: {result.stdout}")
            raise HTTPException(
                status_code=500,
                detail=f"Invalid JSON output from script. Output: {result.stdout[:200]}"
            )
        return GenerateResponse(data=lesson_data)
        
    except subprocess.TimeoutExpired:
        logger.error("Script execution timeout")
        raise HTTPException(
            status_code=504,
            detail="Request timeout: Script took too long to execute"
        )
    except FileNotFoundError as e:
        logger.error(f"File not found: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Python script or interpreter not found: {str(e)}"
        )
    except Exception as e:
        logger.error(f"Unexpected error: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=500,
            detail=f"Unexpected error: {str(e)}"
        )

def clean_response(response):
    # return only the stuff between the first { and the last }
    first_brace = response.find("{")
    last_brace = response.rfind("}")
    if first_brace == -1 or last_brace == -1:
        return response
    return response[first_brace:last_brace+1]

@app.get("/api/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)