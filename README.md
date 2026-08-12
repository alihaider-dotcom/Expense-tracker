# 💰 Personal Expense Tracker

> A minimal, clean web-based expense manager with interactive charts, category-wise summaries, and full CRUD operations.

![HTML](https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=html5&logoColor=white)
![CSS](https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black)
![Python](https://img.shields.io/badge/Python-3776AB?style=flat-square&logo=python&logoColor=white)
![Flask](https://img.shields.io/badge/Flask-000000?style=flat-square&logo=flask&logoColor=white)
![Pandas](https://img.shields.io/badge/Pandas-150458?style=flat-square&logo=pandas&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)

---

## ✨ Features

- **Add, edit, and delete** expense records with title, amount, category, and date
- **Category-wise summaries** — see exactly where your money goes
- **Interactive pie charts and bar graphs** powered by Chart.js
- **Minimal white & grey UI** with clean cards, subtle borders, and rounded corners
- **CSV-based storage** — no database setup required, data lives in a simple file
- **REST API backend** built with Flask + Pandas for data processing and aggregation

---

## 📁 Project Structure

```
expense-tracker/
│
├── 📄 index.html        ← Frontend UI (single page)
├── 📄 style.css         ← Minimal white & grey styling
├── 📄 app.js            ← Frontend logic + Chart.js charts (loaded via CDN)
├── 📄 server.py         ← Flask server with CRUD endpoints using Pandas
├── 📄 expenses.csv      ← Local data store (auto-created on first run)
└── 📄 requirements.txt  ← Python dependencies
```

---

## 🚀 Getting Started

### Prerequisites

- Python 3.8 or higher
- pip

Check your versions:
```bash
python3 --version
pip --version
```

---

### Installation & Run

**Step 1 — Clone the repository**
```bash
git clone https://github.com/YOUR_USERNAME/personal-expense-tracker.git
cd personal-expense-tracker
```

**Step 2 — Create and activate a virtual environment**
```bash
# Create
python3 -m venv venv

# Activate — Mac/Linux
source venv/bin/activate

# Activate — Windows
venv\Scripts\activate
```

**Step 3 — Install dependencies**
```bash
pip install -r requirements.txt
```

**Step 4 — Start the server**
```bash
python server.py
```

**Step 5 — Open in browser**
```
http://localhost:5000
```

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/expenses` | Fetch all expense records |
| `POST` | `/api/expenses` | Add a new expense |
| `PUT` | `/api/expenses/<id>` | Update an existing expense |
| `DELETE` | `/api/expenses/<id>` | Delete an expense by ID |
| `GET` | `/api/summary` | Category-wise totals for charts |

---

## 🎨 Design

Minimal, clean **white & grey** UI with:
- Soft card layouts with rounded corners and subtle shadows
- Responsive single-page layout
- Chart.js loaded via CDN — no build step required
- Color-coded expense categories for quick visual scanning

---

## 📝 Notes

- Expenses are stored in `expenses.csv` — simple, portable, no database setup needed
- For production use, replace CSV storage with SQLite, PostgreSQL, or any database
- Chart.js is loaded from CDN — internet connection required for charts to render
- The virtual environment folder (`venv/`) is excluded from version control via `.gitignore`

---

## 🛠 Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Frontend | HTML5, CSS3, JavaScript | UI and user interactions |
| Charts | Chart.js (CDN) | Pie charts and bar graphs |
| Backend | Python + Flask | REST API and routing |
| Data Processing | Pandas | Aggregation, filtering, summaries |
| Storage | CSV file | Lightweight local data store |

---
