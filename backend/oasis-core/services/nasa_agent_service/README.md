# NASA AI Agent Service 🚀

An intelligent conversational AI agent powered by LangChain, LangGraph, and Google Gemini that provides interactive access to NASA's public APIs.

## Features

### 🌟 **Astronomy Picture of the Day (APOD)**
- Get daily astronomy images with explanations
- Access historical space images by date
- Retrieve HD versions of images

### 🔴 **Mars Rover Photos**
- Browse photos from Curiosity, Opportunity, and Spirit rovers
- Filter by Martian sol (day) or Earth date
- Select specific cameras (FHAZ, RHAZ, MAST, CHEMCAM, etc.)

### ☄️ **Near-Earth Objects**
- Track asteroids approaching Earth
- Get asteroid size estimates and trajectories
- Identify potentially hazardous asteroids

### 🌍 **Earth Imagery**
- Satellite images of any location on Earth
- Landsat 8 imagery
- Customizable image dimensions

### 🛰️ **EPIC Earth Images**
- Full-disc Earth images from DSCOVR satellite
- Natural color imagery
- Daily and historical images

### 🔍 **NASA Image Library**
- Search millions of NASA images and videos
- Filter by media type (image, video, audio)
- Access NASA's entire multimedia collection

### ⚡ **Space Weather (DONKI)**
- Solar flare notifications
- Coronal mass ejection (CME) alerts
- Geomagnetic storm warnings
- Space weather reports

## Architecture

```
┌─────────────────────────────────────────────────────┐
│                   Frontend (Next.js)                │
│              NASA AI Chat Component                 │
└──────────────────────┬──────────────────────────────┘
                       │ HTTP/REST
                       ▼
┌─────────────────────────────────────────────────────┐
│              NASA AI Agent Service (FastAPI)        │
│                                                     │
│  ┌───────────────────────────────────────────────┐ │
│  │         LangGraph Agent Orchestrator          │ │
│  │                                               │ │
│  │  ┌─────────────────────────────────────────┐ │ │
│  │  │     Google Gemini 2.0 Flash            │ │ │
│  │  └─────────────────────────────────────────┘ │ │
│  │                                               │ │
│  │  ┌─────────────────────────────────────────┐ │ │
│  │  │         NASA API Tools                  │ │ │
│  │  │  • APOD         • Mars Rovers           │ │ │
│  │  │  • NeoWs        • EPIC                  │ │ │
│  │  │  • Earth        • Image Library         │ │ │
│  │  │  • DONKI                                │ │ │
│  │  └─────────────────────────────────────────┘ │ │
│  └───────────────────────────────────────────────┘ │
└──────────────────────┬──────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────┐
│              NASA Public APIs                       │
│         api.nasa.gov / images-api.nasa.gov          │
└─────────────────────────────────────────────────────┘
```

## Installation

1. **Install Dependencies**
   ```bash
   cd services/nasa_agent_service
   pip install -r requirements.txt
   ```

2. **Configure Environment**
   Create a `.env` file or set environment variables:
   ```bash
   NASA_API_KEY=your_nasa_api_key_here
   GOOGLE_API_KEY=your_google_api_key_here
   ```

3. **Get API Keys**
   - **NASA API Key**: Get from [api.nasa.gov](https://api.nasa.gov/) (free)
   - **Google API Key**: Get from [Google AI Studio](https://makersuite.google.com/app/apikey)

## Running the Service

### Standalone
```bash
cd services/nasa_agent_service
python -m uvicorn app.main:app --reload --port 8004
```

### Using Batch Script (Windows)
```bash
cd backend/oasis-core
start_nasa.bat
```

### Using Service Manager
```bash
cd backend/oasis-core
python start_services.py
```

## API Endpoints

### POST `/api/v1/chat`
Chat with the NASA AI Agent.

**Request:**
```json
{
  "message": "Show me today's astronomy picture",
  "session_id": "optional-session-id"
}
```

**Response:**
```json
{
  "content": "Here's today's Astronomy Picture of the Day...",
  "session_id": "session_123",
  "timestamp": "2025-10-03T12:00:00",
  "tool_calls": [
    {
      "name": "get_apod",
      "args": {},
      "id": "call_123"
    }
  ],
  "tool_outputs": {
    "get_apod": {
      "title": "NGC 1499: The California Nebula",
      "explanation": "...",
      "url": "https://apod.nasa.gov/...",
      "hdurl": "https://apod.nasa.gov/..."
    }
  },
  "processing_time": 1.23,
  "success": true
}
```

### GET `/api/v1/health`
Health check endpoint.

## Example Queries

### Astronomy
- "Show me today's astronomy picture"
- "Get the APOD from 2024-01-01"
- "What's the astronomy picture of the day?"

### Mars
- "Show me photos from the Curiosity rover"
- "Get Mars rover images from sol 1000"
- "Show me Curiosity's latest photos"

### Asteroids
- "Are there any asteroids approaching Earth?"
- "Show me near-Earth objects for next week"
- "What asteroids are coming close to Earth?"

### Earth
- "Show me a satellite image of Dhaka, Bangladesh"
- "Get Earth imagery at latitude 23.8, longitude 90.4"

### Space Weather
- "What's the current space weather?"
- "Are there any solar flares?"
- "Show me DONKI notifications"

## Frontend Integration

The service is integrated with a dynamic chat UI in the dashboard:

```
frontend/src/app/dashboard/nasa-agent/page.js
frontend/src/components/dashboard/NASAAgent.jsx
```

**Features:**
- 🎨 NASA-themed dark UI with animated stars
- 💬 Real-time chat interface
- 🖼️ Automatic image rendering for visual data
- ⚡ Quick action buttons for common queries
- 📱 Responsive design
- 🔄 Session management

## Technology Stack

- **FastAPI** - High-performance web framework
- **LangChain** - LLM application framework
- **LangGraph** - Stateful agent orchestration
- **Google Gemini 2.0 Flash** - Advanced AI model
- **Pydantic** - Data validation
- **Requests** - HTTP client for NASA APIs

## Configuration

### Settings (`app/core/config.py`)

| Variable | Default | Description |
|----------|---------|-------------|
| `NASA_API_KEY` | `DEMO_KEY` | NASA API key |
| `GOOGLE_API_KEY` | Required | Google Gemini API key |
| `nasa_base_url` | `https://api.nasa.gov` | NASA API base URL |
| `host` | `0.0.0.0` | Service host |
| `port` | `8004` | Service port |

## Development

### Adding New NASA API Tools

1. Create a new tool in `app/tools/nasa_tools.py`:
   ```python
   @tool
   def get_new_api(param: str) -> str:
       """Tool description for the AI agent."""
       # Implementation
       return result
   ```

2. Add to the agent's tool list in `app/core/agent_service.py`:
   ```python
   self.tools = [
       # ... existing tools
       get_new_api
   ]
   ```

### Customizing the Agent

Edit the system prompt in `app/core/agent_service.py` to modify the agent's behavior, personality, and capabilities.

## Troubleshooting

### API Key Issues
- Verify your NASA API key at [api.nasa.gov](https://api.nasa.gov/)
- The DEMO_KEY has rate limits; get a personal key for better performance
- Ensure GOOGLE_API_KEY is set correctly

### CORS Errors
- The service allows all origins by default
- Modify CORS settings in `app/main.py` if needed

### Connection Issues
- Ensure the service is running on port 8004
- Check firewall settings
- Verify frontend is pointing to correct URL

## License

Part of the Oasis Planner project.

## Credits

- NASA Open APIs
- Google Gemini AI
- LangChain & LangGraph frameworks

