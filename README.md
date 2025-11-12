# Wina Bwangu FinTech Dashboard

A FinTech transaction management system with:
- **HTML/CSS/JavaScript** frontend with Chart.js visualization
- **localStorage** for client-side data persistence
- **User authentication** system
- **GitHub Pages** hosting support

## 🌐 Live Demo
Visit the live application: **https://notthe123.github.io/loginpage/**

## GitHub Pages Deployment

This application is configured to run on GitHub Pages as a static site. All data is stored locally in your browser using localStorage.

### How to Deploy Your Own:
1. Fork this repository
2. Go to your repository Settings → Pages
3. Under "Source", select the `main` branch
4. Click Save
5. Your site will be available at `https://YOUR-USERNAME.github.io/loginpage/`

### Note:
- Data is stored in browser localStorage (persists across sessions on the same browser)
- No backend server required
- Works entirely client-side

## Features
- **User Management**: Register and login with secure password hashing
- **Transaction Management**: Track mobile money transactions across multiple booths
- **Real-time Dashboard**: View cumulative totals, revenues, and analytics
- **Service Providers**: Support for Airtel Money, MTN Money, Zamtel Money, Zanaco, and FNB
- **Tax Calculation**: Automatic 5% tax calculation with visual progress bar
- **Monthly Limits**: Enforced transaction limits per service provider
- **Interactive Charts**: Revenue visualization with Chart.js

## Quick Start

### Option 1: Use GitHub Pages (Recommended)
Simply visit the live site: https://notthe123.github.io/loginpage/

### Option 2: Run Locally
1. Clone the repository:
   ```bash
   git clone https://github.com/Notthe123/loginpage.git
   cd loginpage
   ```

2. Open `index.html` in your web browser:
   - **Using Python's built-in server:**
     ```bash
     python3 -m http.server 8000
     ```
     Then visit: http://localhost:8000/

   - **Or simply open the file:**
     - Double-click `index.html` or
     - Right-click → Open with → Your browser

3. **Access the pages:**
   - Login Page: `index.html` or `login-page.html`
   - Register: `register.html`
   - Dashboard: `Wina-bwangu.html`

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
- **Storage**: Browser localStorage stores all transactions and user accounts
- **Persistence**: Data persists across browser sessions (same browser only)
- **Security**: Data is stored locally in your browser
- **Transactions**: Auto-generated IDs with timestamp
- **Tax Rate**: 5% applied to all transactions
- **Note**: Clear browser data will delete all stored information

## Troubleshooting

### Data Not Saving
- **Check**: Ensure your browser allows localStorage
- **Solution**: Check browser settings and enable local storage
- **Note**: Private/Incognito mode may restrict localStorage

### Chart Not Displaying
- **Requirement**: Internet connection needed for Chart.js CDN
- **Alternative**: Download Chart.js locally if offline access is needed

### Login Issues
- **Problem**: Can't log in after registering
- **Solution**: Make sure you're using the exact username and password you registered with
- **Tip**: Check browser console for errors (F12)

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
├── index.html             # Main login page (GitHub Pages entry point)
├── login-page.html        # Alternative login page
├── login-page.css         # Login page styling
├── login.js               # Login functionality (localStorage)
├── register.html          # User registration page
├── register.js            # Registration functionality (localStorage)
├── Wina-bwangu.html       # Main transaction dashboard
├── wina-bwangu.js         # Transaction management (localStorage)
├── wina-bwangu1.css       # Dashboard styling
├── WB.png                 # Logo/image asset
├── success.html           # Post-login success page
├── .gitignore             # Git ignore file
└── README.md              # This file

# Legacy backend files (not used in GitHub Pages deployment)
├── app.py                 # Flask backend (optional local server)
├── requirements.txt       # Python dependencies
└── start.sh               # Startup script
```

## Technologies Used
- **Frontend**: Vanilla JavaScript (ES6+), HTML5, CSS3
- **Visualization**: Chart.js (CDN)
- **Storage**: Browser localStorage API
- **Hosting**: GitHub Pages
- **Styling**: Custom CSS with responsive design
