# Wina Bwangu FinTech Dashboard

A full-stack FinTech transaction management system with:
- **HTML/CSS/JavaScript** frontend with Chart.js visualization
- **Flask** backend with RESTful APIs
- **SQLite** database for secure data persistence
- **User authentication** with password hashing

## Features
- **User Management**: Register and login with secure password hashing
- **Transaction Management**: Track mobile money transactions across multiple booths
- **Real-time Dashboard**: View cumulative totals, revenues, and analytics
- **Service Providers**: Support for Airtel Money, MTN Money, Zamtel Money, Zanaco, and FNB
- **Tax Calculation**: Automatic 5% tax calculation with visual progress bar
- **Monthly Limits**: Enforced transaction limits per service provider
- **Interactive Charts**: Revenue visualization with Chart.js

## Prerequisites
- Python 3.10+ (Linux/macOS/Windows)

## Quick Start

### Option 1: Using the Startup Script (Easiest)
```bash
./start.sh
```

### Option 2: Manual Setup

1) **Install dependencies** (already done if using startup script)
   ```bash
   python3 -m venv .venv
   source .venv/bin/activate
   pip install -r requirements.txt
   ```

2) **Start the server**
   ```bash
   source .venv/bin/activate
   python3 app.py
   ```
   - Server will run on: **http://localhost:8000**

3) **Open your browser**
   - Login Page: http://localhost:8000/
   - Dashboard: http://localhost:8000/Wina-bwangu.html
   - Register: http://localhost:8000/register.html

## Usage

### First Time Setup
1. **Register**: Create an account at http://localhost:8000/register.html
2. **Login**: Sign in at http://localhost:8000/
3. **Dashboard**: Access the transaction dashboard at http://localhost:8000/Wina-bwangu.html

### Managing Transactions
1. Select a mobile booth (Wina1-Wina6) to view its location
2. Choose a service provider (Airtel Money, MTN Money, etc.)
3. Enter transaction amount
4. Submit to record the transaction
5. View real-time updates in dashboard tables and charts

### Dashboard Features
- **Cumulative Totals**: Track total transactions per service with monthly limits
- **Booth Revenues**: Monitor revenue per physical booth location
- **Service Frequency**: Analyze transaction patterns across booths
- **Revenue Chart**: Visual breakdown of revenue vs. tax collection

## Data Storage
- **Database**: SQLite (`wina_bwangu.db`) stores all transactions and users
- **Security**: Passwords are hashed using Werkzeug's secure hashing
- **Transactions**: Auto-generated IDs (WB0000001, WB0000002, etc.)
- **Tax Rate**: 5% applied to all transactions

## Stopping/Restarting the Server
- Stop: press Ctrl+C in the terminal running the server.
- If port 8000 is busy (server didn't stop cleanly), free it on Linux:
  ```bash
  fuser -k 8000/tcp
  ```

## Change Port (optional)
- Run the server on a different port:
  ```bash
  PORT=9000 python app.py
  ```
- Then open: http://localhost:9000

## Troubleshooting

### Flask Not Installed
- **Solution**: Run `pip install -r requirements.txt` after activating the virtual environment

### Port Already in Use
- **Solution**: Kill the process using port 8000:
  ```bash
  fuser -k 8000/tcp
  ```
  Or run on a different port:
  ```bash
  PORT=9000 python3 app.py
  ```

### API Errors / Network Errors
- **Check**: Ensure Flask server is running
- **Verify**: Access pages via http://localhost:8000 (not by opening HTML files directly)
- **Database**: The app auto-creates `wina_bwangu.db` on first run

### Chart Not Displaying
- **Requirement**: Internet connection needed for Chart.js CDN
- **Alternative**: Download Chart.js locally if offline access is needed

### Transaction Not Saving
- **Check**: Ensure the selected service hasn't exceeded its monthly limit
- **Limits**: 
  - Airtel Money: K350,000
  - MTN Money: K160,000
  - Zamtel Money: K70,000
  - Zanaco: K80,000
  - FNB: K80,000

## Project Structure
```
.
├── app.py                 # Flask backend server
├── wina-bwangu.js         # Transaction management JavaScript
├── wina-bwangu1.css       # Dashboard styling
├── Wina-bwangu.html       # Main transaction dashboard
├── login-page.html        # User login page
├── login-page.css         # Login page styling
├── login.js               # Login functionality
├── register.html          # User registration page
├── register.js            # Registration functionality
├── success.html           # Post-login success page
├── wina_bwangu.db         # SQLite database (auto-created)
├── requirements.txt       # Python dependencies
├── start.sh               # Quick startup script
└── README.md              # This file
```

## API Endpoints

### User Management
- `POST /api/register` - Create new user account
- `POST /api/login` - Authenticate user

### Transaction Management
- `GET /api/transactions` - Retrieve all transactions
- `POST /api/transactions` - Create new transaction

## Technologies Used
- **Backend**: Flask 3.0.0, SQLite3, Werkzeug
- **Frontend**: Vanilla JavaScript (ES6+), HTML5, CSS3
- **Visualization**: Chart.js (CDN)
- **Security**: Password hashing with Werkzeug
