// ===================================
// AI Avatar Web Application
// Real-time conversational AI with video avatar
// ===================================

class AIAvatarApp {
    constructor() {
        this.ws = null;
        this.mediaRecorder = null;
        this.audioChunks = [];
        this.isRecording = false;
        this.isConnected = false;
        this.settings = this.loadSettings();
        
        this.init();
    }

    // ===================================
    // Initialization
    // ===================================
    init() {
        this.cacheElements();
        this.attachEventListeners();
        this.initializeAudioVisualizer();
        this.connectWebSocket();
        
        // Hide loading screen after initialization
        setTimeout(() => {
            this.hideLoading();
        }, 2000);
    }

    cacheElements() {
        // Main containers
        this.loadingScreen = document.getElementById('loading-screen');
        this.mainContainer = document.getElementById('main-container');
        
        // Avatar elements
        this.avatarVideo = document.getElementById('avatar-video');
        this.statusDot = document.getElementById('status-dot');
        this.statusText = document.getElementById('status-text');
        this.audioCanvas = document.getElementById('audio-canvas');
        
        // Chat elements
        this.chatMessages = document.getElementById('chat-messages');
        this.messageInput = document.getElementById('message-input');
        this.sendBtn = document.getElementById('send-btn');
        this.voiceBtn = document.getElementById('voice-btn');
        this.charCount = document.getElementById('char-count');
        
        // Modal elements
        this.settingsModal = document.getElementById('settings-modal');
        this.settingsBtn = document.getElementById('settings-btn');
        this.closeSettingsBtn = document.getElementById('close-settings');
        this.saveSettingsBtn = document.getElementById('save-settings');
        this.resetSettingsBtn = document.getElementById('reset-settings');
        
        // Other buttons
        this.fullscreenBtn = document.getElementById('fullscreen-btn');
        this.quickActionBtns = document.querySelectorAll('.quick-action-btn');
    }

    attachEventListeners() {
        // Send message
        this.sendBtn.addEventListener('click', () => this.sendMessage());
        this.messageInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });
        
        // Character count
        this.messageInput.addEventListener('input', () => {
            this.updateCharCount();
            this.autoResizeTextarea();
        });
        
        // Voice recording
        this.voiceBtn.addEventListener('click', () => this.toggleVoiceRecording());
        
        // Settings modal
        this.settingsBtn.addEventListener('click', () => this.openSettings());
        this.closeSettingsBtn.addEventListener('click', () => this.closeSettings());
        this.saveSettingsBtn.addEventListener('click', () => this.saveSettings());
        this.resetSettingsBtn.addEventListener('click', () => this.resetSettings());
        
        // Fullscreen
        this.fullscreenBtn.addEventListener('click', () => this.toggleFullscreen());
        
        // Quick actions
        this.quickActionBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const prompt = btn.getAttribute('data-prompt');
                this.messageInput.value = prompt;
                this.sendMessage();
            });
        });
        
        // Close modal on outside click
        this.settingsModal.addEventListener('click', (e) => {
            if (e.target === this.settingsModal) {
                this.closeSettings();
            }
        });
    }

    // ===================================
    // WebSocket Connection
    // ===================================
    connectWebSocket() {
        const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        const wsUrl = `${protocol}//${window.location.host}/ws`;
        
        try {
            this.ws = new WebSocket(wsUrl);
            
            this.ws.onopen = () => {
                console.log('WebSocket connected');
                this.isConnected = true;
                this.updateStatus('connected', 'Connected');
            };
            
            this.ws.onmessage = (event) => {
                this.handleWebSocketMessage(event);
            };
            
            this.ws.onerror = (error) => {
                console.error('WebSocket error:', error);
                this.updateStatus('error', 'Connection Error');
            };
            
            this.ws.onclose = () => {
                console.log('WebSocket disconnected');
                this.isConnected = false;
                this.updateStatus('disconnected', 'Disconnected');
                
                // Attempt to reconnect after 3 seconds
                setTimeout(() => {
                    if (!this.isConnected) {
                        this.connectWebSocket();
                    }
                }, 3000);
            };
        } catch (error) {
            console.error('Failed to create WebSocket:', error);
            this.updateStatus('error', 'Connection Failed');
        }
    }

    handleWebSocketMessage(event) {
        try {
            const data = JSON.parse(event.data);
            
            switch (data.type) {
                case 'response':
                    this.addMessage('assistant', data.message);
                    if (data.audio) {
                        this.playAudioResponse(data.audio);
                    }
                    break;
                    
                case 'avatar_update':
                    this.updateAvatarVideo(data.videoUrl);
                    break;
                    
                case 'status':
                    this.updateStatus(data.status, data.message);
                    break;
                    
                case 'error':
                    this.showError(data.message);
                    break;
                    
                default:
                    console.log('Unknown message type:', data.type);
            }
        } catch (error) {
            console.error('Error parsing WebSocket message:', error);
        }
    }

    // ===================================
    // Message Handling
    // ===================================
    sendMessage() {
        const message = this.messageInput.value.trim();
        
        if (!message || !this.isConnected) {
            return;
        }
        
        // Add user message to chat
        this.addMessage('user', message);
        
        // Send to server
        this.ws.send(JSON.stringify({
            type: 'message',
            content: message,
            timestamp: new Date().toISOString()
        }));
        
        // Clear input
        this.messageInput.value = '';
        this.updateCharCount();
        this.autoResizeTextarea();
        
        // Show typing indicator
        this.showTypingIndicator();
    }

    addMessage(sender, content) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}`;
        
        const contentDiv = document.createElement('div');
        contentDiv.className = 'message-content';
        contentDiv.textContent = content;
        
        const timeSpan = document.createElement('span');
        timeSpan.className = 'message-time';
        timeSpan.textContent = this.formatTime(new Date());
        
        messageDiv.appendChild(contentDiv);
        messageDiv.appendChild(timeSpan);
        
        // Remove welcome message if it exists
        const welcomeMessage = this.chatMessages.querySelector('.welcome-message');
        if (welcomeMessage) {
            welcomeMessage.remove();
        }
        
        this.chatMessages.appendChild(messageDiv);
        this.scrollToBottom();
        
        // Hide typing indicator
        if (sender === 'assistant') {
            this.hideTypingIndicator();
        }
    }

    showTypingIndicator() {
        const indicator = document.querySelector('.typing-indicator');
        if (indicator) {
            indicator.classList.remove('hidden');
        }
    }

    hideTypingIndicator() {
        const indicator = document.querySelector('.typing-indicator');
        if (indicator) {
            indicator.classList.add('hidden');
        }
    }

    scrollToBottom() {
        this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
    }

    updateCharCount() {
        const count = this.messageInput.value.length;
        this.charCount.textContent = `${count} / 500`;
        
        if (count > 500) {
            this.charCount.style.color = 'var(--error)';
        } else {
            this.charCount.style.color = 'var(--text-muted)';
        }
    }

    autoResizeTextarea() {
        this.messageInput.style.height = 'auto';
        this.messageInput.style.height = this.messageInput.scrollHeight + 'px';
    }

    // ===================================
    // Voice Recording
    // ===================================
    async toggleVoiceRecording() {
        if (!this.isRecording) {
            await this.startRecording();
        } else {
            this.stopRecording();
        }
    }

    async startRecording() {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            this.mediaRecorder = new MediaRecorder(stream);
            this.audioChunks = [];
            
            this.mediaRecorder.ondataavailable = (event) => {
                this.audioChunks.push(event.data);
            };
            
            this.mediaRecorder.onstop = () => {
                const audioBlob = new Blob(this.audioChunks, { type: 'audio/webm' });
                this.sendAudioMessage(audioBlob);
            };
            
            this.mediaRecorder.start();
            this.isRecording = true;
            this.voiceBtn.classList.add('recording');
            
        } catch (error) {
            console.error('Error accessing microphone:', error);
            this.showError('Could not access microphone. Please check permissions.');
        }
    }

    stopRecording() {
        if (this.mediaRecorder && this.isRecording) {
            this.mediaRecorder.stop();
            this.mediaRecorder.stream.getTracks().forEach(track => track.stop());
            this.isRecording = false;
            this.voiceBtn.classList.remove('recording');
        }
    }

    async sendAudioMessage(audioBlob) {
        const reader = new FileReader();
        reader.onloadend = () => {
            const base64Audio = reader.result.split(',')[1];
            
            if (this.isConnected) {
                this.ws.send(JSON.stringify({
                    type: 'audio',
                    content: base64Audio,
                    timestamp: new Date().toISOString()
                }));
                
                this.addMessage('user', '🎤 Voice message');
                this.showTypingIndicator();
            }
        };
        reader.readAsDataURL(audioBlob);
    }

    // ===================================
    // Avatar & Audio
    // ===================================
    updateAvatarVideo(videoUrl) {
        if (videoUrl) {
            this.avatarVideo.src = videoUrl;
            this.avatarVideo.classList.add('active');
            
            const placeholder = document.querySelector('.avatar-placeholder');
            if (placeholder) {
                placeholder.style.display = 'none';
            }
        }
    }

    playAudioResponse(audioData) {
        if (this.settings.autoPlay) {
            const audio = new Audio(`data:audio/mp3;base64,${audioData}`);
            audio.volume = this.settings.volume / 100;
            audio.playbackRate = this.settings.speed;
            audio.play().catch(error => {
                console.error('Error playing audio:', error);
            });
        }
    }

    initializeAudioVisualizer() {
        const ctx = this.audioCanvas.getContext('2d');
        const width = this.audioCanvas.width;
        const height = this.audioCanvas.height;
        
        // Simple animated visualizer
        const bars = 20;
        const barWidth = width / bars;
        
        const animate = () => {
            ctx.clearRect(0, 0, width, height);
            ctx.fillStyle = 'rgba(99, 102, 241, 0.5)';
            
            for (let i = 0; i < bars; i++) {
                const barHeight = Math.random() * height * 0.7;
                const x = i * barWidth;
                const y = (height - barHeight) / 2;
                
                ctx.fillRect(x, y, barWidth - 2, barHeight);
            }
            
            requestAnimationFrame(animate);
        };
        
        animate();
    }

    // ===================================
    // Status & UI Updates
    // ===================================
    updateStatus(status, message) {
        this.statusText.textContent = message;
        this.statusDot.className = 'status-dot';
        
        if (status === 'connected') {
            this.statusDot.classList.add('connected');
        } else if (status === 'error' || status === 'disconnected') {
            this.statusDot.classList.add('error');
        }
    }

    showError(message) {
        this.addMessage('assistant', `⚠️ Error: ${message}`);
    }

    hideLoading() {
        this.loadingScreen.classList.add('hidden');
        this.mainContainer.classList.remove('hidden');
    }

    // ===================================
    // Settings
    // ===================================
    openSettings() {
        this.settingsModal.classList.remove('hidden');
        this.loadSettingsToUI();
    }

    closeSettings() {
        this.settingsModal.classList.add('hidden');
    }

    loadSettingsToUI() {
        document.getElementById('voice-select').value = this.settings.voice;
        document.getElementById('speed-slider').value = this.settings.speed;
        document.getElementById('volume-slider').value = this.settings.volume;
        document.getElementById('auto-play').checked = this.settings.autoPlay;
        document.getElementById('show-transcript').checked = this.settings.showTranscript;
        
        document.getElementById('speed-value').textContent = `${this.settings.speed}x`;
        document.getElementById('volume-value').textContent = `${this.settings.volume}%`;
        
        // Update sliders in real-time
        document.getElementById('speed-slider').addEventListener('input', (e) => {
            document.getElementById('speed-value').textContent = `${e.target.value}x`;
        });
        
        document.getElementById('volume-slider').addEventListener('input', (e) => {
            document.getElementById('volume-value').textContent = `${e.target.value}%`;
        });
    }

    saveSettings() {
        this.settings = {
            voice: document.getElementById('voice-select').value,
            speed: parseFloat(document.getElementById('speed-slider').value),
            volume: parseInt(document.getElementById('volume-slider').value),
            autoPlay: document.getElementById('auto-play').checked,
            showTranscript: document.getElementById('show-transcript').checked
        };
        
        localStorage.setItem('aiAvatarSettings', JSON.stringify(this.settings));
        this.closeSettings();
        
        // Show confirmation
        this.addMessage('assistant', '✅ Settings saved successfully!');
    }

    resetSettings() {
        this.settings = this.getDefaultSettings();
        localStorage.removeItem('aiAvatarSettings');
        this.loadSettingsToUI();
        this.addMessage('assistant', '🔄 Settings reset to default values.');
    }

    loadSettings() {
        const saved = localStorage.getItem('aiAvatarSettings');
        return saved ? JSON.parse(saved) : this.getDefaultSettings();
    }

    getDefaultSettings() {
        return {
            voice: 'default',
            speed: 1.0,
            volume: 80,
            autoPlay: true,
            showTranscript: true
        };
    }

    // ===================================
    // Fullscreen
    // ===================================
    toggleFullscreen() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(err => {
                console.error('Error attempting to enable fullscreen:', err);
            });
        } else {
            document.exitFullscreen();
        }
    }

    // ===================================
    // Utilities
    // ===================================
    formatTime(date) {
        return date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
        });
    }
}

// ===================================
// Initialize Application
// ===================================
document.addEventListener('DOMContentLoaded', () => {
    window.aiAvatarApp = new AIAvatarApp();
});

// ===================================
// Service Worker Registration (Optional)
// ===================================
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').then(
            registration => console.log('ServiceWorker registered:', registration.scope),
            err => console.log('ServiceWorker registration failed:', err)
        );
    });
}
