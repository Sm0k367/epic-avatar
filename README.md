# 🤖 AI Avatar - Real-time Conversational AI

<div align="center">

![AI Avatar](https://img.shields.io/badge/AI-Avatar-blue?style=for-the-badge&logo=robot)
![Python](https://img.shields.io/badge/Python-3.8+-green?style=for-the-badge&logo=python)
![Flask](https://img.shields.io/badge/Flask-3.0-black?style=for-the-badge&logo=flask)
![License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)

**A hyper-realistic AI avatar that engages in real-time, unbiased conversations with users through an intuitive web interface.**

[Features](#-features) • [Quick Start](#-quick-start) • [Documentation](#-documentation) • [Demo](#-demo) • [Contributing](#-contributing)

</div>

---

## ✨ Features

### 🎭 **Hyper-Realistic Avatar**
- Lifelike video avatar powered by D-ID technology
- Natural facial expressions and lip-sync
- Multiple avatar options to choose from

### 💬 **Real-time Conversations**
- Instant AI responses powered by OpenAI GPT-4
- WebSocket-based real-time communication
- Context-aware conversations with memory

### 🎤 **Voice Interaction**
- Speech-to-text using OpenAI Whisper
- Text-to-speech with ElevenLabs
- Natural voice conversations

### 🎨 **Modern UI/UX**
- Beautiful, responsive design
- Dark mode interface
- Smooth animations and transitions
- Mobile-friendly

### ⚙️ **Customizable Settings**
- Multiple voice options
- Adjustable speech speed
- Volume control
- Auto-play preferences

### 🔒 **Secure & Private**
- API keys stored securely
- No data logging
- Privacy-focused design

---

## 🚀 Quick Start

### Prerequisites

- **Python 3.8+** - [Download](https://www.python.org/downloads/)
- **Node.js 16+** (optional, for avatar integration) - [Download](https://nodejs.org/)
- **API Keys**:
  - OpenAI API Key (required) - [Get it here](https://platform.openai.com/api-keys)
  - D-ID API Key (optional) - [Get it here](https://studio.d-id.com/)
  - ElevenLabs API Key (optional) - [Get it here](https://elevenlabs.io/)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Sm0k367/epic-avatar.git
   cd epic-avatar
   ```

2. **Set up environment**
   ```bash
   # Copy environment template
   cp config/.env.example config/.env
   
   # Edit config/.env and add your API keys
   nano config/.env  # or use your preferred editor
   ```

3. **Install dependencies**
   ```bash
   # Create virtual environment
   python3 -m venv venv
   
   # Activate virtual environment
   # On Linux/Mac:
   source venv/bin/activate
   # On Windows:
   venv\Scripts\activate
   
   # Install Python packages
   pip install -r requirements.txt
   ```

4. **Run the application**
   ```bash
   # Using the startup script (recommended)
   # On Linux/Mac:
   ./scripts/start.sh
   
   # On Windows:
   scripts\start.bat
   
   # Or run directly:
   python backend/server.py
   ```

5. **Open in browser**
   ```
   http://localhost:5000
   ```

---

## 📖 Documentation

### Configuration

Edit `config/.env` to configure your API keys and settings:

```env
# Required
OPENAI_API_KEY=your_openai_api_key_here

# Optional (for enhanced features)
D_ID_API_KEY=your_d_id_api_key_here
ELEVENLABS_API_KEY=your_elevenlabs_api_key_here

# Server settings
HOST=0.0.0.0
PORT=5000
DEBUG=False
```

### Project Structure

```
ai-avatar-webapp/
├── frontend/              # Frontend files
│   ├── index.html        # Main HTML
│   ├── styles.css        # Styling
│   └── app.js            # JavaScript logic
├── backend/              # Backend server
│   ├── server.py         # Flask server
│   └── avatar_integration.js  # D-ID integration
├── config/               # Configuration
│   ├── .env.example      # Environment template
│   └── .env              # Your API keys (not in git)
├── scripts/              # Utility scripts
│   ├── start.sh          # Linux/Mac startup
│   └── start.bat         # Windows startup
├── docs/                 # Additional documentation
├── requirements.txt      # Python dependencies
├── package.json          # Node dependencies
└── README.md            # This file
```

### API Endpoints

- `GET /` - Main application
- `GET /health` - Health check
- `GET /api/config` - Get configuration
- `WebSocket /ws` - Real-time communication

For detailed API documentation, see [API_DOCUMENTATION.md](docs/API_DOCUMENTATION.md)

---

## 🎯 Usage

### Text Chat
1. Type your message in the input box
2. Press Enter or click the send button
3. Watch the AI avatar respond in real-time

### Voice Chat
1. Click the microphone button
2. Speak your message
3. Click again to stop recording
4. The avatar will respond with voice and video

### Settings
- Click the settings icon to customize:
  - Avatar voice
  - Speech speed
  - Volume
  - Auto-play preferences

---

## 🛠️ Development

### Running in Development Mode

```bash
# Enable debug mode in config/.env
DEBUG=True

# Run with auto-reload
python backend/server.py
```

### Testing

```bash
# Run tests
pytest

# Run with coverage
pytest --cov=backend
```

### Code Style

```bash
# Format code
black backend/

# Lint code
flake8 backend/
```

---

## 🌐 Deployment

### Deploy to Heroku

```bash
# Login to Heroku
heroku login

# Create app
heroku create your-app-name

# Set environment variables
heroku config:set OPENAI_API_KEY=your_key

# Deploy
git push heroku main
```

### Deploy to AWS/GCP/Azure

See [DEPLOYMENT_GUIDE.md](docs/DEPLOYMENT_GUIDE.md) for detailed deployment instructions.

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **OpenAI** - GPT-4 and Whisper API
- **D-ID** - Avatar video generation
- **ElevenLabs** - Text-to-speech
- **Flask** - Web framework
- **Epic Tech AI** - Development team

---

## 📧 Contact

**Epic Tech AI**
- Email: epictechai@gmail.com
- GitHub: [@Sm0k367](https://github.com/Sm0k367)

---

## 🌟 Star History

If you find this project useful, please consider giving it a star! ⭐

---

<div align="center">

**Built with 💜 by Epic Tech AI**

*Manifesting the impossible, one conversation at a time.*

</div>
