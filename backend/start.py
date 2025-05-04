#!/usr/bin/env python3
"""
Simple production server script for the Flask application.
This file serves as the entry point for Render and other deployment platforms.
"""
import os
from waitress import serve
from app import app

if __name__ == "__main__":
    # Get port from environment variable or default to 10000
    port = int(os.environ.get("PORT", 10000))
    
    # Log startup message
    print(f"Starting server on port {port}...")
    
    # Serve the application
    serve(app, host="0.0.0.0", port=port) 