const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// MySQL connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'zxcv1234',
    database: 'screenpass'
});

// Database setup function
function setupDatabase() {
    const createUsersTable = `
        CREATE TABLE IF NOT EXISTS users (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(255) NOT NULL
        )
    `;
    
    const createBookingsTable = `
        CREATE TABLE IF NOT EXISTS bookings (
            username VARCHAR(255) NOT NULL,
            seatCount INT,
            movieName VARCHAR(255)
        )
    `;

    const createMoviesListTable = `
        CREATE TABLE IF NOT EXISTS moviesList (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(255) NOT NULL
        )
    `;

    db.query(createUsersTable, (err) => {
        if (err) throw err;
        console.log('Users table created or already exists.');
        
        db.query(createBookingsTable, (err) => {
            if (err) throw err;
            console.log('Bookings table created or already exists.');
            
            db.query(createMoviesListTable, (err) => {
                if (err) throw err;
                console.log('MoviesList table created or already exists.');
                
                // Optionally, add sample movies if the table is empty
                db.query('SELECT COUNT(*) as count FROM moviesList', (err, result) => {
                    if (err) throw err;
                    if (result[0].count === 0) {
                        const sampleMovies = [
                            'The Shawshank Redemption',
                            'The Godfather',
                            'The Dark Knight',
                            '12 Angry Men',
                            'Schindler',
                        ];
                        const insertMovies = 'INSERT INTO moviesList (name) VALUES ?';
                        db.query(insertMovies, [sampleMovies.map(movie => [movie])], (err) => {
                            if (err) throw err;
                            console.log('Sample movies added to moviesList table.');
                        });
                    }
                });
            });
        });
    });
}

// Connect to MySQL and setup database
db.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        return;
    }
    console.log('MySQL connected...');
    setupDatabase();
});

// Fetch movies
app.get('/movies', (req, res) => {
    const sql = 'SELECT * FROM moviesList';
    db.query(sql, (err, result) => {
        if (err) {
            console.error('Error fetching movies:', err);
            res.status(500).json({ error: 'Error fetching movies' });
            return;
        }
        res.json(result);
    });
});

// Book a movie
app.post('/book', (req, res) => {
    console.log('Received booking request:', req.body);
    const { userName, movieName, seatCount } = req.body;
    
    if (!userName || !movieName || !seatCount) {
        console.error('Missing required fields:', { userName, movieName, seatCount });
        return res.status(400).json({ error: 'Missing required fields' });
    }

    const bookingSql = 'INSERT INTO bookings (username, seatCount, movieName) VALUES (?, ?, ?)';
    db.query(bookingSql, [userName, seatCount, movieName], (err, bookingResult) => {
        if (err) {
            console.error('Error inserting booking:', err);
            return res.status(500).json({ error: 'Error inserting booking', details: err.message });
        }
        
        console.log('Booking inserted:', bookingResult);
        res.json({ message: 'Booking successful!' });
    });
});

// Fetch all bookings
app.get('/bookings', (req, res) => {
    const sql = 'SELECT * FROM bookings';
    db.query(sql, (err, result) => {
        if (err) {
            console.error('Error fetching bookings:', err);
            res.status(500).json({ error: 'Error fetching bookings' });
            return;
        }
        res.json(result);
    });
});

// Start the server
app.listen(8080, () => {
    console.log('Server running on port 8080');
});