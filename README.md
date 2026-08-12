Personal Expense Tracker

A minimal, white & grey personal expense tracker built with HTML/CSS/JS and a small Python (Flask + Pandas) backend.

Files
- index.html - frontend UI
- style.css - minimal white/grey styling
- app.js - frontend logic + charts (uses Chart.js via CDN)
- server.py - Flask server with CRUD endpoints using pandas and CSV storage
- expenses.csv - sample data store
- requirements.txt - Python dependencies

Run
1. Create a Python virtualenv and install deps:
   python3 -m venv venv
   source venv/bin/activate
   pip install -r requirements.txt

2. Start the server:
   python server.py

3. Open the app in a browser:
   http://localhost:5000/

Notes
- The app stores expenses in a local CSV file (expenses.csv) so it's simple to start.
- Chart.js is loaded from CDN for charts.
- For production, replace CSV storage with a real database.

Design
Minimal, clean white & grey UI with subtle borders and rounded cards.

License
MIT
