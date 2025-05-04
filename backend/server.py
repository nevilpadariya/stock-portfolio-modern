#!/usr/bin/env python3
# A simplified entry point for Gunicorn

# Import the Flask app directly from the local app.py file
from app import app

# This is used when running directly
if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5001) 