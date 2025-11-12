from flask import Flask, request, jsonify, send_from_directory
import os
import sqlite3
import re
from werkzeug.security import generate_password_hash, check_password_hash

app = Flask(__name__, static_folder='.', static_url_path='')

# Database setup
DB_PATH = os.path.join(os.path.dirname(__file__), 'wina_bwangu.db')

def _connect_db():
    conn = sqlite3.connect(DB_PATH, check_same_thread=False)
    conn.row_factory = sqlite3.Row
    return conn

def _init_db():
    """Initialize database with required tables"""
    conn = _connect_db()
    try:
        # Create transactions table
        conn.execute(
            """
            CREATE TABLE IF NOT EXISTS transactions (
                TransactionID VARCHAR(20) PRIMARY KEY,
                MobileBooth VARCHAR(20),
                Location VARCHAR(50),
                Service VARCHAR(50),
                RevenuePerKwacha DECIMAL(5,3),
                TransactionAmount DECIMAL(10,2)
            )
            """
        )
        # Create users table
        conn.execute(
            """
            CREATE TABLE IF NOT EXISTS users (
                username TEXT PRIMARY KEY,
                password_hash TEXT NOT NULL
            )
            """
        )
        conn.commit()
    finally:
        conn.close()

_init_db()

@app.route('/')
def root():
    return send_from_directory(app.static_folder, 'login-page.html')

@app.route('/api/register', methods=['POST'])
def register():
    payload = request.get_json(silent=True) or {}
    username = (payload.get('username') or '').strip()
    password = payload.get('password') or ''
    if not username or not password:
        return jsonify(ok=False, message='Username and password are required'), 400
    conn = _connect_db()
    try:
        cur = conn.execute("SELECT 1 FROM users WHERE username = ?", (username,))
        if cur.fetchone():
            return jsonify(ok=False, message='Username already exists'), 409
        pwd_hash = generate_password_hash(password)
        conn.execute(
            "INSERT INTO users (username, password_hash) VALUES (?, ?)",
            (username, pwd_hash)
        )
        conn.commit()
        return jsonify(ok=True)
    finally:
        conn.close()

@app.route('/api/login', methods=['POST'])
def login():
    payload = request.get_json(silent=True) or {}
    username = (payload.get('username') or '').strip()
    password = payload.get('password') or ''
    conn = _connect_db()
    try:
        cur = conn.execute("SELECT password_hash FROM users WHERE username = ?", (username,))
        row = cur.fetchone()
        if not row or not check_password_hash(row[0], password):
            return jsonify(ok=False, message='Invalid username or password'), 401
        return jsonify(ok=True)
    finally:
        conn.close()

def _generate_next_id(conn):
    cur = conn.execute("SELECT TransactionID FROM transactions ORDER BY TransactionID DESC LIMIT 1")
    row = cur.fetchone()
    if not row or not row[0]:
        return 'WB0000001'
    last = row[0]
    m = re.match(r'^(WB)(\d{7})$', last)
    if not m:
        return 'WB0000001'
    prefix, num = m.groups()
    next_num = int(num) + 1
    return f"{prefix}{next_num:07d}"

def _service_rate(service):
    # Map service to RevenuePerKwacha if provided; default 0.05
    mapping = {
        'Airtel Money': 0.05,
        'MTN Money': 0.06,
        'Zamtel Money': 0.045,
        'Zanaco': 0.05,
        'FNB': 0.05,
    }
    return mapping.get(service, 0.05)

@app.route('/api/transactions', methods=['GET'])
def get_transactions():
    conn = _connect_db()
    try:
        cur = conn.execute('SELECT TransactionID, MobileBooth, Location, Service, RevenuePerKwacha, TransactionAmount FROM transactions')
        rows = [dict(r) for r in cur.fetchall()]
        return jsonify(ok=True, data=rows)
    finally:
        conn.close()

@app.route('/api/transactions', methods=['POST'])
def create_transaction():
    payload = request.get_json(silent=True) or {}
    booth = (payload.get('booth') or '').strip()
    service = (payload.get('service') or '').strip()
    amount = payload.get('amount')
    location = (payload.get('location') or '').strip()
    if not booth or not service or amount is None:
        return jsonify(ok=False, message='booth, service, and amount are required'), 400
    try:
        amount = float(amount)
    except (TypeError, ValueError):
        return jsonify(ok=False, message='amount must be a number'), 400

    # If location not provided, leave blank; frontend can map
    rate = _service_rate(service)
    conn = _connect_db()
    try:
        txn_id = _generate_next_id(conn)
        conn.execute(
            'INSERT INTO transactions (TransactionID, MobileBooth, Location, Service, RevenuePerKwacha, TransactionAmount) VALUES (?, ?, ?, ?, ?, ?)',
            (txn_id, booth, location, service, rate, amount)
        )
        conn.commit()
        return jsonify(ok=True, id=txn_id)
    except sqlite3.IntegrityError:
        return jsonify(ok=False, message='Failed to insert transaction'), 500
    finally:
        conn.close()

@app.route('/<path:path>')
def static_proxy(path):
    return send_from_directory(app.static_folder, path)

if __name__ == '__main__':
    port = int(os.environ.get('PORT', '8000'))
    app.run(host='0.0.0.0', port=port, debug=False)
