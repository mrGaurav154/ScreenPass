const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const app = express();
const PORT = 8080;
const path = require('path');


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // ← this is important
app.use(express.static('public'));


// ✅ MySQL Connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'zxcv1234', // Replace with your password if different
  database: 'screenpass'
});

// ✅ Setup Tables if not exist
function setupDatabase() {
  const createBookingsTable = `
    CREATE TABLE IF NOT EXISTS bookings (
      id INT AUTO_INCREMENT PRIMARY KEY,
      username VARCHAR(255) NOT NULL,
      seatCount INT,
      movieName VARCHAR(255),
      mobileNumber VARCHAR(15)
    )
  `;

  const createMoviesListTable = `
    CREATE TABLE IF NOT EXISTS moviesList (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL
    )
  `;

  const createAdminTable = `
    CREATE TABLE IF NOT EXISTS admin (
      id INT AUTO_INCREMENT PRIMARY KEY,
      username VARCHAR(255) NOT NULL,
      password VARCHAR(255) NOT NULL
    )
  `;

  db.query(createBookingsTable, err => {
    if (err) throw err;
    console.log('✅ bookings table created or exists.');

    db.query(createMoviesListTable, err => {
      if (err) throw err;
      console.log('✅ moviesList table created or exists.');

      db.query('SELECT COUNT(*) AS count FROM moviesList', (err, result) => {
        if (err) throw err;
        if (result[0].count === 0) {
          const sampleMovies = [
            'The Shawshank Redemption',
            'The Godfather',
            'The Dark Knight',
            '12 Angry Men',
            'Schindler\'s List'
          ];
          const insertMovies = 'INSERT INTO moviesList (name) VALUES ?';
          db.query(insertMovies, [sampleMovies.map(name => [name])]);
          console.log('✅ Sample movies inserted');
        }
      });
    });

    db.query(createAdminTable, err => {
      if (err) throw err;
      console.log('✅ admin table created or exists.');
      // Optional: Insert default admin if table empty
      db.query('SELECT COUNT(*) AS count FROM admin', (err, result) => {
        if (result[0].count === 0) {
          db.query(
            'INSERT INTO admin (username, password) VALUES (?, ?)',
            ['admin', 'admin123']
          );
          console.log('✅ Default admin inserted');
        }
      });
    });
  });
}

db.connect(err => {
  if (err) {
    console.error('❌ MySQL connection failed:', err);
    return;
  }
  console.log('✅ MySQL Connected');
  setupDatabase();
});

// ✅ Login Route
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  db.query(
    'SELECT * FROM admin WHERE username = ? AND password = ?',
    [username, password],
    (err, results) => {
      if (err) return res.status(500).json({ message: 'Server error' });

      if (results.length > 0) {
        res.json({ success: true, message: 'Login successful!' });
      } else {
        res.json({ success: false, message: 'Invalid username or password' });
      }
    }
  );
});

// ✅ Get All Movies
app.get('/movies', (req, res) => {
  db.query('SELECT * FROM moviesList', (err, result) => {
    if (err) return res.status(500).json({ error: 'Error fetching movies' });
    res.json(result);
  });
});

// ✅ Book a Ticket
app.post('/book', (req, res) => {
  const { username, seatCount, movieName, mobileNumber } = req.body;
  if (!username || !seatCount || !movieName || !mobileNumber) {
    return res.status(400).json({ error: 'Missing fields' });
  }

  const sql = 'INSERT INTO bookings (username, seatCount, movieName, mobileNumber) VALUES (?, ?, ?, ?)';
  db.query(sql, [username, seatCount, movieName, mobileNumber], (err, result) => {
    if (err) return res.status(500).json({ error: 'Booking failed', details: err.message });
    res.json({ message: 'Booking successful!' });
  });
});

// ✅ Get All Bookings
app.get('/bookings', (req, res) => {
  db.query('SELECT * FROM bookings', (err, result) => {
    if (err) return res.status(500).json({ error: 'Error fetching bookings' });
    res.json(result);
  });
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname,'public', 'book.html'));
});

// ✅ Start the Server
app.listen(PORT,'0.0.0.0', () => {
  console.log(`🚀 Server running at http://192.168.56.1:${8080}`);
});
