from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import requests
from pymongo import MongoClient
from datetime import datetime
import os
import whisper
import tempfile
from openai import OpenAI
import json
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

app = FastAPI(title="Xcall - AI Sales Coach")

# MongoDB connection
MONGODB_URI = os.getenv("MONGODB_URI", "mongodb+srv://username:password@cluster.mongodb.net/xcall")
client = MongoClient(MONGODB_URI)
db = client.xcall
calls_collection = db.calls

# Aircall API configuration
AIRCALL_API_TOKEN = os.getenv("AIRCALL_API_TOKEN", "your_aircall_api_token_here")
AIRCALL_BASE_URL = "https://api.aircall.io/v1"

# Whisper model initialization
whisper_model = whisper.load_model("base")

# OpenAI client initialization
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY", "your_openai_api_key_here")
openai_client = OpenAI(api_key=OPENAI_API_KEY)

# Email configuration
SMTP_SERVER = os.getenv("SMTP_SERVER", "smtp.gmail.com")
SMTP_PORT = int(os.getenv("SMTP_PORT", "587"))
SMTP_USERNAME = os.getenv("SMTP_USERNAME", "your_email@gmail.com")
SMTP_PASSWORD = os.getenv("SMTP_PASSWORD", "your_app_password")

class CallEndedPayload(BaseModel):
    id: str
    user: dict

@app.post("/aircall/call-ended")
async def handle_call_ended(payload: CallEndedPayload):
    """
    Webhook endpoint to handle call ended events from Aircall
    """
    try:
        call_id = payload.id
        user_id = payload.user.get("id")
        
        # Fetch call details from Aircall API (mock)
        call_details = fetch_call_details(call_id)
        recording_url = call_details.get("recording_url")
        
        # Fetch user details from Aircall API (mock)
        user_details = fetch_user_details(user_id)
        agent_email = user_details.get("email")
        
        # Real transcription using Whisper AI
        transcript = transcribe_audio(recording_url)
        
        # LLM analysis with structured feedback
        analysis_result = analyze_call_with_llm(transcript, agent_email)
        
        # Store in MongoDB
        call_document = {
            "call_id": call_id,
            "agent_email": agent_email,
            "recording_url": recording_url,
            "transcript": transcript,
            "analysis": analysis_result,
            "created_at": datetime.utcnow()
        }
        
        result = calls_collection.insert_one(call_document)
        
        # Send immediate feedback email
        send_feedback_email(agent_email, call_id, analysis_result)
        
        return {
            "status": "ok",
            "agent_email": agent_email,
            "call_id": call_id,
            "analysis": analysis_result
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

def fetch_call_details(call_id: str) -> dict:
    """
    Mock function to fetch call details from Aircall API
    In production, this would make a real API call
    """
    # Mock response - replace with actual Aircall API call
    return {
        "id": call_id,
        "recording_url": f"https://api.aircall.io/v1/calls/{call_id}/recording",
        "duration": 300,
        "status": "done"
    }

def fetch_user_details(user_id: str) -> dict:
    """
    Mock function to fetch user details from Aircall API
    In production, this would make a real API call
    """
    # Mock response - replace with actual Aircall API call
    return {
        "id": user_id,
        "email": f"agent{user_id}@company.com",
        "name": f"Agent {user_id}"
    }

def transcribe_audio(recording_url: str) -> str:
    """
    Download audio from recording URL and transcribe using Whisper AI
    """
    try:
        # Download the audio file
        response = requests.get(recording_url, stream=True)
        response.raise_for_status()
        
        # Create a temporary file to store the audio
        with tempfile.NamedTemporaryFile(suffix=".mp3", delete=False) as temp_file:
            for chunk in response.iter_content(chunk_size=8192):
                temp_file.write(chunk)
            temp_file_path = temp_file.name
        
        # Transcribe using Whisper
        result = whisper_model.transcribe(temp_file_path)
        transcript = result["text"].strip()
        
        # Clean up temporary file
        os.unlink(temp_file_path)
        
        return transcript
        
    except Exception as e:
        # Fallback to mock transcript if transcription fails
        print(f"Transcription failed: {e}")
        return "Hello this is a mock transcript (transcription failed)"

def analyze_call_with_llm(transcript: str, agent_email: str) -> dict:
    """
    Analyze call transcript using OpenAI LLM and return structured feedback
    """
    try:
        # Build the prompt with company context and best practices
        prompt = f"""
You are an expert sales coach analyzing a sales call transcript. Provide detailed feedback to help the salesperson improve.

COMPANY CONTEXT:
- We are a B2B SaaS company
- Our product helps businesses streamline their operations
- Target audience: Mid-market companies (50-500 employees)
- Average deal size: $10K-50K annually

BEST PRACTICES:
- Always start with rapport building
- Ask open-ended discovery questions
- Listen actively and acknowledge pain points
- Present solutions that address specific needs
- Handle objections professionally
- Always close with next steps

CALL TRANSCRIPT:
{transcript}

Please analyze this call and provide structured feedback in the following JSON format:
{{
    "call_summary": "Brief summary of what happened in the call",
    "call_outcome": "booked_meeting|sale_closed|follow_up_required|no_outcome",
    "top_3_improvements": [
        "Specific, actionable improvement 1",
        "Specific, actionable improvement 2", 
        "Specific, actionable improvement 3"
    ],
    "better_responses": [
        "Example of a better way to respond to a specific situation",
        "Another example of improved response"
    ],
    "recurring_objections": [
        "List any objections or blockers mentioned"
    ],
    "call_structure_analysis": {{
        "intro_present": true/false,
        "discovery_questions_asked": true/false,
        "pain_points_identified": true/false,
        "solution_presented": true/false,
        "objections_handled": true/false,
        "next_steps_defined": true/false
    }},
    "overall_score": 1-10,
    "key_insights": "Additional insights for the salesperson"
}}

Focus on being constructive, specific, and actionable. Base your analysis on the actual transcript content.
"""

        response = openai_client.chat.completions.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": "You are an expert sales coach. Always respond with valid JSON format."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.3,
            max_tokens=1500
        )
        
        # Parse the JSON response
        analysis_text = response.choices[0].message.content
        analysis_result = json.loads(analysis_text)
        
        return analysis_result
        
    except Exception as e:
        print(f"LLM analysis failed: {e}")
        # Fallback to mock analysis
        return {
            "call_summary": "Call analysis failed - using fallback data",
            "call_outcome": "follow_up_required",
            "top_3_improvements": [
                "Ask more open-ended discovery questions",
                "Better handle objections about budget",
                "Define clear next steps at the end"
            ],
            "better_responses": [
                "Instead of 'Is this something you're interested in?', try 'What would need to happen for this to make sense for your team?'",
                "When they mention budget concerns, ask 'What's your typical process for evaluating new tools?'"
            ],
            "recurring_objections": ["Budget approval", "Timing concerns"],
            "call_structure_analysis": {
                "intro_present": True,
                "discovery_questions_asked": False,
                "pain_points_identified": True,
                "solution_presented": True,
                "objections_handled": False,
                "next_steps_defined": False
            },
            "overall_score": 6,
            "key_insights": "Focus on discovery questions and objection handling"
        }

def send_feedback_email(agent_email: str, call_id: str, analysis: dict) -> None:
    """
    Send immediate feedback email to the salesperson
    """
    try:
        # Create email content
        subject = f"🎯 Call Analysis Feedback - Call ID: {call_id}"
        
        # Build HTML email content
        html_content = f"""
        <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
                <h2 style="color: #2c3e50;">🎯 Your Call Analysis is Ready!</h2>
                
                <div style="background: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
                    <h3 style="color: #495057; margin-top: 0;">Call Summary</h3>
                    <p>{analysis.get('call_summary', 'N/A')}</p>
                </div>
                
                <div style="background: #e8f5e8; padding: 15px; border-radius: 5px; margin: 20px 0;">
                    <h3 style="color: #2d5a2d; margin-top: 0;">📊 Call Outcome</h3>
                    <p><strong>{analysis.get('call_outcome', 'N/A').replace('_', ' ').title()}</strong></p>
                    <p><strong>Overall Score:</strong> {analysis.get('overall_score', 'N/A')}/10</p>
                </div>
                
                <div style="background: #fff3cd; padding: 15px; border-radius: 5px; margin: 20px 0;">
                    <h3 style="color: #856404; margin-top: 0;">🚀 Top 3 Improvements</h3>
                    <ol>
                        {''.join([f'<li>{improvement}</li>' for improvement in analysis.get('top_3_improvements', [])])}
                    </ol>
                </div>
                
                <div style="background: #d1ecf1; padding: 15px; border-radius: 5px; margin: 20px 0;">
                    <h3 style="color: #0c5460; margin-top: 0;">💡 Better Responses for Next Time</h3>
                    <ul>
                        {''.join([f'<li>{response}</li>' for response in analysis.get('better_responses', [])])}
                    </ul>
                </div>
                
                <div style="background: #f8d7da; padding: 15px; border-radius: 5px; margin: 20px 0;">
                    <h3 style="color: #721c24; margin-top: 0;">⚠️ Recurring Objections</h3>
                    <ul>
                        {''.join([f'<li>{objection}</li>' for objection in analysis.get('recurring_objections', [])])}
                    </ul>
                </div>
                
                <div style="background: #e2e3e5; padding: 15px; border-radius: 5px; margin: 20px 0;">
                    <h3 style="color: #383d41; margin-top: 0;">📋 Call Structure Analysis</h3>
                    <ul>
                        <li>Introduction: {'✅' if analysis.get('call_structure_analysis', {}).get('intro_present') else '❌'}</li>
                        <li>Discovery Questions: {'✅' if analysis.get('call_structure_analysis', {}).get('discovery_questions_asked') else '❌'}</li>
                        <li>Pain Points Identified: {'✅' if analysis.get('call_structure_analysis', {}).get('pain_points_identified') else '❌'}</li>
                        <li>Solution Presented: {'✅' if analysis.get('call_structure_analysis', {}).get('solution_presented') else '❌'}</li>
                        <li>Objections Handled: {'✅' if analysis.get('call_structure_analysis', {}).get('objections_handled') else '❌'}</li>
                        <li>Next Steps Defined: {'✅' if analysis.get('call_structure_analysis', {}).get('next_steps_defined') else '❌'}</li>
                    </ul>
                </div>
                
                <div style="background: #d4edda; padding: 15px; border-radius: 5px; margin: 20px 0;">
                    <h3 style="color: #155724; margin-top: 0;">🔍 Key Insights</h3>
                    <p>{analysis.get('key_insights', 'N/A')}</p>
                </div>
                
                <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
                <p style="color: #6c757d; font-size: 12px;">
                    This feedback was generated by Xcall AI Sales Coach. 
                    Keep improving and closing more deals! 💪
                </p>
            </div>
        </body>
        </html>
        """
        
        # Create message
        msg = MIMEMultipart('alternative')
        msg['Subject'] = subject
        msg['From'] = SMTP_USERNAME
        msg['To'] = agent_email
        
        # Attach HTML content
        html_part = MIMEText(html_content, 'html')
        msg.attach(html_part)
        
        # Send email
        server = smtplib.SMTP(SMTP_SERVER, SMTP_PORT)
        server.starttls()
        server.login(SMTP_USERNAME, SMTP_PASSWORD)
        server.send_message(msg)
        server.quit()
        
        print(f"Feedback email sent to {agent_email}")
        
    except Exception as e:
        print(f"Failed to send email to {agent_email}: {e}")
        # Don't raise exception - email failure shouldn't break the main flow

@app.get("/")
async def root():
    return {"message": "Xcall - AI Sales Coach API"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
