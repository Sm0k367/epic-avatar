"""
Vercel Serverless Function for Health Check
"""
from http.server import BaseHTTPRequestHandler
import json
from datetime import datetime

class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        result = {
            'status': 'healthy',
            'timestamp': datetime.now().isoformat(),
            'platform': 'vercel',
            'message': 'AI Avatar API is running'
        }
        
        self.send_response(200)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        self.wfile.write(json.dumps(result).encode('utf-8'))
