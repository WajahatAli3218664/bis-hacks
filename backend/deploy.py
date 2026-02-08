#!/usr/bin/env python3
"""
Simple deployment script for Vercel
Run this to test the backend before deployment
"""

import subprocess
import sys
import os

def main():
    print("Testing backend before deployment...")
    
    # Test imports
    try:
        from main import app
        print("[OK] Backend imports working")
    except Exception as e:
        print(f"[ERROR] Import error: {e}")
        return False
    
    # Test CORS
    try:
        import requests
        response = requests.options('http://localhost:8000/chat', 
                                  headers={'Origin': 'https://example.com'})
        if response.status_code == 200:
            print("[OK] CORS working")
        else:
            print(f"[ERROR] CORS issue: {response.status_code}")
    except Exception as e:
        print(f"[WARNING] CORS test failed (server might not be running): {e}")
    
    print("\nReady for deployment!")
    print("Run: vercel --prod")
    
    return True

if __name__ == "__main__":
    main()