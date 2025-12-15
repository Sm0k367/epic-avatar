# 📡 API Documentation

Complete API reference for the AI Avatar backend.

## Base URL

```
http://localhost:5000
```

## Endpoints

### GET /

**Description:** Serve the main application interface

**Response:** HTML page

---

### GET /health

**Description:** Health check endpoint

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2024-01-15T10:30:00Z",
  "active_connections": 3
}
```

---

### GET /api/config

**Description:** Get client configuration and available features

**Response:**
```json
{
  "features": {
    "text_chat": true,
    "voice_input": true,
    "avatar_video": true,
    "text_to_speech": true
  }
}
```

---

## WebSocket API

### Connection

**Endpoint:** `ws://localhost:5000/ws`

**Protocol:** WebSocket

### Message Types

#### 1. Text Message (Client → Server)

```json
{
  "type": "message",
  "content": "Hello, how are you?",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

#### 2. Audio Message (Client → Server)

```json
{
  "type": "audio",
  "content": "base64_encoded_audio_data",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

#### 3. Response (Server → Client)

```json
{
  "type": "response",
  "message": "I'm doing great, thank you!",
  "audio": "base64_encoded_audio_data",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

#### 4. Status Update (Server → Client)

```json
{
  "type": "status",
  "status": "connected",
  "message": "Connected to AI Avatar"
}
```

#### 5. Error (Server → Client)

```json
{
  "type": "error",
  "message": "Error description"
}
```

#### 6. Avatar Update (Server → Client)

```json
{
  "type": "avatar_update",
  "videoUrl": "https://example.com/video.mp4"
}
```

---

## Error Codes

| Code | Description |
|------|-------------|
| 400 | Bad Request - Invalid message format |
| 401 | Unauthorized - Invalid API key |
| 429 | Too Many Requests - Rate limit exceeded |
| 500 | Internal Server Error |
| 503 | Service Unavailable - AI service down |

---

## Rate Limits

- **Text messages:** 60 per minute
- **Voice messages:** 30 per minute
- **WebSocket connections:** 10 per IP

---

## Authentication

API keys are configured server-side in `config/.env`. No client-side authentication required.

---

## Examples

### JavaScript Client

```javascript
// Connect to WebSocket
const ws = new WebSocket('ws://localhost:5000/ws');

// Send text message
ws.send(JSON.stringify({
  type: 'message',
  content: 'Hello!',
  timestamp: new Date().toISOString()
}));

// Receive response
ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  console.log('Response:', data.message);
};
```

### Python Client

```python
import websocket
import json

def on_message(ws, message):
    data = json.loads(message)
    print(f"Response: {data['message']}")

ws = websocket.WebSocketApp(
    "ws://localhost:5000/ws",
    on_message=on_message
)

# Send message
ws.send(json.dumps({
    "type": "message",
    "content": "Hello!",
    "timestamp": "2024-01-15T10:30:00Z"
}))
```

---

## Best Practices

1. **Handle reconnections** - WebSocket may disconnect
2. **Validate messages** - Check message format before sending
3. **Rate limiting** - Respect rate limits
4. **Error handling** - Always handle error messages
5. **Timeouts** - Set reasonable timeouts for responses

---

## Support

For API support, open an issue on GitHub or contact epictechai@gmail.com
