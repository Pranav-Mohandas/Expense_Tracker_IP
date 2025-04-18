// server1.js
const express = require('express');
const mysql = require('mysql');
const util = require('util');
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static(__dirname)); // Serve static files (IP.js, IP.css, index.html)
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

// Database configuration (using your provided credentials)
const db = mysql.createConnection({
  host: 'localhost',
  user: 'newuser',
  password: 'newpassword',
  database: 'expenses_db'
});

// Connect to MySQL
db.connect(err => {
  if (err) throw err;
  console.log('✅ MySQL connected.');
  
  // Create expense1 table if not exists (with your specified structure)
  db.query(`CREATE TABLE IF NOT EXISTS expense1 (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    category VARCHAR(100) NOT NULL,
  )`, (err) => {
    if (err) throw err;
    console.log('✅ expense1 table ready');
  });
});

const queryAsync = util.promisify(db.query).bind(db);

// API Endpoints

// Add new expense
app.post('/add-expense', async (req, res) => {
  const { name, amount, category } = req.body;
  
  if (!name || !amount || !category) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const sql = 'INSERT INTO expense1 (name, amount, category) VALUES (?, ?, ?)';
    const result = await queryAsync(sql, [name, parseFloat(amount), category]);
    res.json({ 
      id: result.insertId,
      name,
      amount,
      category
    });
  } catch (err) {
    console.error('❌ Error adding expense:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

// Get all expenses grouped by category with totals
app.get('/expenses', async (req, res) => {
  try {
    const sql = `
      SELECT 
        category, 
        SUM(amount) AS total,
        COUNT(*) AS count,
        JSON_ARRAYAGG(
          JSON_OBJECT(
            'id', id,
            'name', name,
            'amount', amount,
          )
        ) AS items
      FROM expense1
      GROUP BY category
      ORDER BY total DESC
    `;
    const results = await queryAsync(sql);
    res.json(results);
  } catch (err) {
    console.error('❌ Error fetching expenses:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

// Get grand total
app.get('/expenses/total', async (req, res) => {
  try {
    const sql = 'SELECT SUM(amount) AS grandTotal FROM expense1';
    const results = await queryAsync(sql);
    res.json({ 
      grandTotal: results[0].grandTotal || 0 
    });
  } catch (err) {
    console.error('❌ Error calculating total:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

// Delete expense by ID
app.delete('/expenses/:id', async (req, res) => {
  try {
    const sql = 'DELETE FROM expense1 WHERE id = ?';
    await queryAsync(sql, [req.params.id]);
    res.sendStatus(200);
  } catch (err) {
    console.error('❌ Error deleting expense:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});