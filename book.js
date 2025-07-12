// Hardcoded movie data (you can replace this with an API call if you prefer)
const moviesData = [
  {
    id: 1,
    name: "Hacker",
    image: "images/hacker.jpg"
  },
  {
    id: 2,
    name: "The Godfather",
    image: "images/godfather.jpg"
  },
  {
    id: 3,
    name: "Special 26",
    image: "images/special26.jpg"
  },
  {
    id: 4,
    name: "AngryBird",
    image: "images/angrybird.webp"
  },
  {
    id: 5,
    name: "Spiderman",
    image: "images/spiderman.jpg"
  }
];
// Load hardcoded movies into the page
function loadMovies() {
    const movieList = document.getElementById('movieList');
    const movieSelect = document.getElementById('movieName');

    movieList.innerHTML = ''; // Clear existing content
    movieSelect.innerHTML = '<option value="">Select a movie</option>'; // Reset dropdown

    moviesData.forEach(movie => {
        // Add movie cards to the movie list section
        const movieCard = document.createElement('div');
        movieCard.classList.add('movie-card');
        movieCard.innerHTML = ` <img src="${movie.image}" alt="${movie.name}" class="movie-img" />
                <h3>${movie.name}</h3>`;
        movieList.appendChild(movieCard);

        // Add movie options to the booking form dropdown
        const movieOption = document.createElement('option');
        movieOption.value = movie.name;
        movieOption.textContent = movie.name;
        movieSelect.appendChild(movieOption);
    });
}

// Handle movie booking form submission
document.getElementById('bookingForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const movieName = document.getElementById('movieName').value;
    const seatCount = document.getElementById('seatCount').value;
    const userName = document.getElementById('userName').value;

    if (movieName && seatCount && userName) {
        // Prepare the data to be sent
        const bookingData = {
            userName: userName,
            movieName: movieName,
            seatCount: parseInt(seatCount, 10) // Ensure seatCount is sent as a number
        };

        // Make the POST API call to /book
        fetch('http://localhost:8080/book', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(bookingData)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            // Show success message
            document.getElementById('bookingResult').textContent = `Booking successful! ${userName}, you've booked ${seatCount} seat(s) for ${movieName}.`;
            
            // Reset form fields
            document.getElementById('movieName').value = '';
            document.getElementById('seatCount').value = '';
            document.getElementById('userName').value = '';
        })
        .catch(error => {
            // Show error message
            document.getElementById('bookingResult').textContent = 'Error: Booking failed. Please try again.';
            console.error('Error:', error);
        });
    } else {
        document.getElementById('bookingResult').textContent = 'Please fill in all fields.';
    }
});

// Load movies when the page is ready
window.onload = loadMovies;