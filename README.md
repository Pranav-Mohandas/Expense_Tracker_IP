# Expense_Tracker_IP
# Expense Tracker

A simple expense tracking application with MySQL backend.

## Features
- Add expenses with name, amount and category
- View expenses by category
- See total spending
- Data saved in MySQL database

## Requirements
- Node.js
- MySQL

## Setup

1. Clone the repository
```bash
git clone https://github.com/yourusername/expense-tracker.git
cd expense-tracker
```

2. Set up MySQL database
```sql
CREATE DATABASE expense_manager;
CREATE USER 'newuser'@'localhost' IDENTIFIED BY 'newpassword';
GRANT ALL PRIVILEGES ON expense_manager.* TO 'newuser'@'localhost';
FLUSH PRIVILEGES;
```

3. Install dependencies
```bash
npm install
```

4. Start the server
```bash
node server1.js
```

5. Open `index.html` in your browser

## Files
- `index.html` - Main page
- `IP.css` - Styles
- `IP.js` - Frontend logic
- `server1.js` - Backend server

## How to Use
1. Enter expense details
2. Click "Add Expense"
3. View your expenses below

The app will automatically:
- Save expenses to database
- Group by category
- Calculate totals
- Warn if over limit
