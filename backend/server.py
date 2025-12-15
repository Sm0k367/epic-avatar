#!/usr/bin/env python3
"""
AI Avatar Backend Server
Flask + WebSocket server for real-time AI avatar communication
"""

import os
import json
import asyncio
import base64
from datetime import datetime
from pathlib import Path
from typing import Dict, Optional

from flask import Flask, render_template, send_from_directory, request
from flask_cors import CORS
from flask_sock import Sock
import openai
from dotenv import load_dotenv

# Load environment variables
load_dotenv(Path(__file__).parent.parent / 'config' / '.env')

# Initialize Flask app
app = Flask(__name__,
            static_folder='../frontend',
            template_folder='../frontend')
CORS(app)
sock = Sock(app)

# Configuration
class Config:
    OPENAI_API_KEY = os.getenv('OPENAI_API_KEY', '')
    ELEVENLABS_API_KEY = os.getenv('ELEVENLABS_API_KEY', '')
    D_ID_API_KEY = os.getenv('D_ID_API_KEY', '')
    PORT = int(os.getenv('PORT', 5000))
    HOST = os.getenv('HOST', '0.0.0.0')
    DEBUG = os.getenv('DEBUG', 'False').lower() == 'true'

# Initialize OpenAI
openai.api_key = Config.OPENAI_API_KEY

# Store active WebSocket connections
active_connections: Dict[str, any] = {}

# Conversation history
conversation_history: Dict[str, list] = {}


class AIAvatarService:
    """Service for handling AI avatar interactions"""
    
    def __init__(self):
        self.system_prompt = """You are a helpful, friendly, and unbiased AI assistant. 
        You provide accurate, thoughtful responses to any questions without bias or judgment.
        You are conversational, engaging, and aim to be as helpful as possible.
        Keep your responses concise but informative, suitable for voice delivery."""
    
    async def generate_response(self, user_message: str, session_id: str) -> str:
        """Generate AI response using OpenAI"""
        try:
            # Get or create conversation history
            if session_id not in conversation_history:
                conversation_history[session_id] = [
                    {"role": "system", "content": self.system_prompt}
                ]
            
            # Add user message
            conversation_history[session_id].append({
                "role": "user",
                "content": user_message
            })
            
            # Generate response
            response = openai.ChatCompletion.create(
                model="gpt-4",
                messages=conversation_history[session_id],
                max_tokens=500,
                temperature=0.7
            )
            
            assistant_message = response.choices[0].message.content
            
            # Add to history
            conversation_history[session_id].append({
                "role": "assistant",
                "content": assistant_message
            })
            
            # Keep only last 10 messages to manage context
            if len(conversation_history[session_id]) > 21:  # 1 system + 20 messages
                conversation_history[session_id] = [
                    conversation_history[session_id][0]  # Keep system message
                ] + conversation_history[session_id][-20:]
            
            return assistant_message
            
        except Exception as e:
            print(f"Error generating response: {e}")
            return "I apologize, but I encountered an error processing your request. Please try again."
    
    async def text_to_speech(self, text: str) -> Optional[str]:
        """Convert text to speech using ElevenLabs API"""
        try:
            # This is a placeholder - implement actual ElevenLabs integration
            # For now, return None to indicate no audio
            return None
        except Exception as e:
            print(f"Error in text-to-speech: {e}")
            return None
    
    async def generate_avatar_video(self, text: str, audio_url: Optional[str] = None) -> Optional[str]:
        """Generate avatar video using D-ID API"""
        try:
            # This is a placeholder - implement actual D-ID integration
            # For now, return None to indicate no video
            return None
        except Exception as e:
            print(f"Error generating avatar video: {e}")
            return None
    
    async def transcribe_audio(self, audio_data: bytes) -> str:
        """Transcribe audio using OpenAI Whisper"""
        try:
            # Save audio temporarily
            temp_file = Path('/tmp/audio_input.webm')
            with open(temp_file, 'wb') as f:
                f.write(audio_data)
            
            # Transcribe
            with open(temp_file, 'rb') as audio_file:
                transcript = openai.Audio.transcribe(
                    model="whisper-1",
                    file=audio_file
                )
            
            # Clean up
            temp_file.unlink()
            
            return transcript.text
            
        except Exception as e:
            print(f"Error transcribing audio: {e}")
            return ""


# Initialize service
ai_service = AIAvatarService()


@app.route('/')
def index():
    """Serve the main application"""
    return send_from_directory('../frontend', 'index.html')


@app.route('/<path:path>')
def serve_static(path):
    """Serve static files"""
    return send_from_directory('../frontend', path)


@sock.route('/ws')
def websocket(ws):
    """WebSocket endpoint for real-time communication"""
    session_id = str(id(ws))
    active_connections[session_id] = ws
    
    print(f"Client connected: {session_id}")
    
    # Send welcome message
    ws.send(json.dumps({
        'type': 'status',
        'status': 'connected',
        'message': 'Connected to AI Avatar'
    }))
    
    try:
        while True:
            message = ws.receive()
            if message is None:
                break
            
            # Parse message
            try:
                data = json.loads(message)
                asyncio.run(handle_websocket_message(ws, session_id, data))
            except json.JSONDecodeError:
                ws.send(json.dumps({
                    'type': 'error',
                    'message': 'Invalid message format'
                }))
    
    except Exception as e:
        print(f"WebSocket error: {e}")
    
    finally:
        # Clean up
        if session_id in active_connections:
            del active_connections[session_id]
        if session_id in conversation_history:
            del conversation_history[session_id]
        print(f"Client disconnected: {session_id}")


async def handle_websocket_message(ws, session_id: str, data: dict):
    """Handle incoming WebSocket messages"""
    message_type = data.get('type')
    
    if message_type == 'message':
        # Text message
        user_message = data.get('content', '')
        
        if not user_message:
            return
        
        # Generate AI response
        response = await ai_service.generate_response(user_message, session_id)
        
        # Send response
        ws.send(json.dumps({
            'type': 'response',
            'message': response,
            'timestamp': datetime.now().isoformat()
        }))
        
        # Generate audio (optional)
        audio_data = await ai_service.text_to_speech(response)
        if audio_data:
            ws.send(json.dumps({
                'type': 'response',
                'message': response,
                'audio': audio_data,
                'timestamp': datetime.now().isoformat()
            }))
    
    elif message_type == 'audio':
        # Voice message
        audio_base64 = data.get('content', '')
        
        if not audio_base64:
            return
        
        # Decode audio
        audio_data = base64.b64decode(audio_base64)
        
        # Transcribe
        transcribed_text = await ai_service.transcribe_audio(audio_data)
        
        if transcribed_text:
            # Generate response
            response = await ai_service.generate_response(transcribed_text, session_id)
            
            # Send response
            ws.send(json.dumps({
                'type': 'response',
                'message': response,
                'transcription': transcribed_text,
                'timestamp': datetime.now().isoformat()
            }))


@app.route('/health')
def health_check():
    """Health check endpoint"""
    return {
        'status': 'healthy',
        'timestamp': datetime.now().isoformat(),
        'active_connections': len(active_connections)
    }


@app.route('/api/config')
def get_config():
    """Get client configuration"""
    return {
        'features': {
            'text_chat': True,
            'voice_input': bool(Config.OPENAI_API_KEY),
            'avatar_video': bool(Config.D_ID_API_KEY),
            'text_to_speech': bool(Config.ELEVENLABS_API_KEY)
        }
    }


def main():
    """Run the server"""
    print(f"""
    ╔══════════════════════════════════════════════════════════╗
    ║                                                          ║
    ║           🤖 AI Avatar Server Starting...               ║
    ║                                                          ║
    ╚══════════════════════════════════════════════════════════╝
    
    Server running at: http://{Config.HOST}:{Config.PORT}
    
    Features:
    ✓ Real-time WebSocket communication
    ✓ AI-powered conversations (OpenAI GPT-4)
    ✓ Voice transcription (Whisper)
    {'✓' if Config.ELEVENLABS_API_KEY else '✗'} Text-to-speech (ElevenLabs)
    {'✓' if Config.D_ID_API_KEY else '✗'} Avatar video generation (D-ID)
    
    Press Ctrl+C to stop the server
    """)
    
    app.run(
        host=Config.HOST,
        port=Config.PORT,
        debug=Config.DEBUG
    )


if __name__ == '__main__':
    main()
