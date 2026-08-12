#!/usr/bin/env python3
import os
import uuid
from flask import Flask, jsonify, request, send_from_directory, abort
from flask_cors import CORS
import pandas as pd

APP_DIR = os.path.abspath(os.path.dirname(__file__))
DATA_FILE = os.path.join(APP_DIR, 'expenses.csv')

app = Flask(__name__)
CORS(app)

# Ensure CSV exists with header
if not os.path.exists(DATA_FILE):
    df = pd.DataFrame(columns=['id','date','amount','category','description'])
    df.to_csv(DATA_FILE, index=False)

def read_data():
    df = pd.read_csv(DATA_FILE, dtype={'id':str})
    return df

def write_data(df):
    df.to_csv(DATA_FILE, index=False)

@app.route('/')
def index():
    return send_from_directory(APP_DIR, 'index.html')

@app.route('/<path:filename>')
def serve_file(filename):
    # serve static assets (style.css, app.js, etc.) from project root
    full = os.path.join(APP_DIR, filename)
    if os.path.exists(full):
        return send_from_directory(APP_DIR, filename)
    abort(404)

@app.route('/api/expenses', methods=['GET'])
def get_expenses():
    df = read_data()
    rows = df.to_dict(orient='records')
    # ensure types
    for r in rows:
        r['amount'] = float(r['amount']) if r.get('amount') not in (None, '') else 0.0
    return jsonify(rows)

@app.route('/api/expenses', methods=['POST'])
def add_expense():
    payload = request.get_json() or {}
    required = ('date','amount','category')
    if not all(k in payload and payload[k]!='' for k in required):
        return jsonify({'error':'Missing fields'}), 400
    new = {
        'id': str(uuid.uuid4()),
        'date': payload['date'],
        'amount': float(payload['amount']),
        'category': payload.get('category','').strip(),
        'description': payload.get('description','')
    }
    df = read_data()
    df = df.append(new, ignore_index=True)
    write_data(df)
    return jsonify(new), 201

@app.route('/api/expenses/<string:item_id>', methods=['PUT'])
def update_expense(item_id):
    payload = request.get_json() or {}
    df = read_data()
    if item_id not in df['id'].astype(str).values:
        return jsonify({'error':'Not found'}), 404
    idx = df.index[df['id']==item_id][0]
    df.at[idx,'date'] = payload.get('date', df.at[idx,'date'])
    df.at[idx,'amount'] = float(payload.get('amount', df.at[idx,'amount']))
    df.at[idx,'category'] = payload.get('category', df.at[idx,'category'])
    df.at[idx,'description'] = payload.get('description', df.at[idx,'description'])
    write_data(df)
    return jsonify(df.loc[idx].to_dict())

@app.route('/api/expenses/<string:item_id>', methods=['DELETE'])
def delete_expense(item_id):
    df = read_data()
    if item_id not in df['id'].astype(str).values:
        return jsonify({'error':'Not found'}), 404
    df = df[df['id']!=item_id]
    write_data(df)
    return jsonify({'ok':True})

@app.route('/api/summary', methods=['GET'])
def summary():
    df = read_data()
    if df.empty:
        return jsonify({'category_totals':[], 'monthly_totals':[]})
    df['amount'] = pd.to_numeric(df['amount'], errors='coerce').fillna(0.0)
    # category totals
    cat = df.groupby('category', dropna=False)['amount'].sum().reset_index()
    cat = cat.sort_values('amount', ascending=False)
    cat_list = [{'category': row['category'], 'total': float(row['amount'])} for _, row in cat.iterrows()]
    # monthly totals
    df['date'] = pd.to_datetime(df['date'], errors='coerce')
    df = df.dropna(subset=['date'])
    if df.empty:
        monthly = []
    else:
        df['month'] = df['date'].dt.strftime('%Y-%m')
        monthly_df = df.groupby('month')['amount'].sum().reset_index().sort_values('month')
        monthly = [{'month': r['month'], 'total': float(r['amount'])} for _, r in monthly_df.iterrows()]
    return jsonify({'category_totals':cat_list, 'monthly_totals':monthly})

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    print(f"Starting server on http://localhost:{port}")
    app.run(host='0.0.0.0', port=port, debug=True)
