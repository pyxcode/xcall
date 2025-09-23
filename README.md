# Xcall - AI Sales Coach

A minimal but functional MVP of an AI sales coach connected to Aircall.

## Features

- **Webhook endpoint**: `/aircall/call-ended` (POST) to receive Aircall webhook events
- **Call details fetching**: Mock Aircall API integration to get call and user information
- **Transcription**: Real-time audio transcription using OpenAI Whisper AI
- **LLM analysis**: Real AI-powered call analysis with structured feedback
- **MongoDB storage**: Store call data and feedback in MongoDB Atlas
- **JSON response**: Return structured response with call status

## Setup

1. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

2. **Set environment variables**:
   ```bash
   export MONGODB_URI="mongodb+srv://username:password@cluster.mongodb.net/xcall"
   export AIRCALL_API_TOKEN="your_aircall_api_token_here"
   export OPENAI_API_KEY="your_openai_api_key_here"
   export SMTP_SERVER="smtp.gmail.com"
   export SMTP_PORT="587"
   export SMTP_USERNAME="your_email@gmail.com"
   export SMTP_PASSWORD="your_app_password"
   ```
   
   **Note**: Whisper AI est open source et ne nécessite aucune clé API !

3. **Run the application**:
   ```bash
   uvicorn main:app --reload
   ```

The API will be available at `http://localhost:8000`

## API Endpoints

- `GET /` - Root endpoint
- `GET /health` - Health check
- `POST /aircall/call-ended` - Webhook endpoint for Aircall call events

## Webhook Payload

The `/aircall/call-ended` endpoint expects a JSON payload with:
```json
{
  "id": "call_id",
  "user": {
    "id": "user_id"
  }
}
```

## Response

Returns:
```json
{
  "status": "ok",
  "agent_email": "agent@company.com",
  "call_id": "call_id"
}
```

## MongoDB Document Structure

Stored documents include:
- `call_id`: Aircall call identifier
- `agent_email`: Agent's email address
- `recording_url`: URL to call recording
- `transcript`: Call transcription (real Whisper AI)
- `analysis`: Comprehensive AI analysis including:
  - Call summary and outcome
  - Top 3 improvements
  - Better response examples
  - Recurring objections
  - Call structure analysis
  - Overall score and insights
- `created_at`: Timestamp

## Development Notes

- All Aircall API calls are currently mocked
- **Whisper AI integration**: Real audio transcription from recording URLs
- **OpenAI GPT-4 integration**: Real AI-powered call analysis and feedback
- **Email notifications**: Automatic feedback emails sent to salespeople
- No authentication or error handling implemented
- Ready for production integration with real APIs

## Whisper AI Integration

The application now includes real-time audio transcription using OpenAI's Whisper AI:

- **Open source & free** - No API key required!
- Downloads audio files from Aircall recording URLs
- Uses Whisper "base" model for transcription
- Runs entirely locally on your machine
- Handles temporary file management automatically
- Falls back to mock transcript if transcription fails
- Supports various audio formats (MP3, WAV, etc.)

### Whisper Model Options

You can change the Whisper model by modifying the model name in `main.py`:
- `tiny` - Fastest, least accurate
- `base` - Good balance (default)
- `small` - Better accuracy
- `medium` - High accuracy
- `large` - Best accuracy, slowest

## OpenAI GPT-4 Integration

The application uses OpenAI's GPT-4 for intelligent call analysis:

- **Structured prompts** with company context and best practices
- **Comprehensive analysis** including call outcome, improvements, and insights
- **Call structure evaluation** (intro, discovery, pitch, closing)
- **Objection tracking** for recurring patterns
- **Personalized feedback** tailored to each call
- **Fallback system** with mock data if API fails

## Email Feedback System

Automatic email notifications are sent to salespeople after each call:

- **Beautiful HTML emails** with structured feedback
- **Call summary** and outcome tracking
- **Top 3 improvements** with actionable advice
- **Better response examples** for future calls
- **Recurring objections** tracking
- **Call structure analysis** with visual indicators
- **Overall score** and key insights

### Email Configuration

Configure your SMTP settings for email delivery:
- Gmail: Use App Passwords for authentication
- Other providers: Adjust SMTP server and port accordingly