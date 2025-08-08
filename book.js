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
    movieSelect.innerHTML = '<option value="" disabled selected>Select a movie</option>'; // Reset dropdown

    moviesData.forEach(movie => {
        // Add movie cards to the movie list section
        const movieCard = document.createElement('div');
        movieCard.classList.add('movie-card');
        movieCard.innerHTML = `
            <img src="${movie.image}" alt="${movie.name}" class="movie-img" />
            <h3>${movie.name}</h3>
        `;
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
    const userName = document.getElementById('userName').value; // Fixed: was 'username'
    const mobileNumber = document.getElementById('mobileNumber').value; // Added missing field

    if (movieName && seatCount && userName && mobileNumber) {
        // Prepare the data to be sent
        const bookingData = {
            username: userName,
            movieName: movieName,
            seatCount: parseInt(seatCount, 10),
            mobileNumber: mobileNumber // Added missing field
        };

        // Make the POST API call to /book
        fetch('/book', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(bookingData)
        })
        .then(response => {
            if (!response.ok) {
                return response.json().then(err => Promise.reject(err));
            }
            return response.json();
        })
        .then(data => {
            // Show success message
            document.getElementById('bookingResult').innerHTML = `
                <div style="color: green; padding: 10px; border: 1px solid green; border-radius: 5px; margin-top: 10px;">
                    <strong>Booking Confirmed!</strong><br>
                    ${userName}, you've successfully booked ${seatCount} seat(s) for "${movieName}".<br>
                    Mobile: ${mobileNumber}
                </div>
            `;
            
            // Reset form fields
            document.getElementById('bookingForm').reset();
        })
        .catch(error => {
            // Show error message with more details
            let errorMessage = 'Booking failed. Please try again.';
            if (error.error) {
                errorMessage = error.error;
            }
            
            document.getElementById('bookingResult').innerHTML = `
                <div style="color: red; padding: 10px; border: 1px solid red; border-radius: 5px; margin-top: 10px;">
                    <strong>Error:</strong> ${errorMessage}
                </div>
            `;
            console.error('Booking Error:', error);
        });
    } else {
        document.getElementById('bookingResult').innerHTML = `
            <div style="color: orange; padding: 10px; border: 1px solid orange; border-radius: 5px; margin-top: 10px;">
                <strong>Please fill in all fields:</strong><br>
                - Movie selection<br>
                - Number of seats<br>
                - Your name<br>
                - Mobile number
            </div>
        `;
    }
});

// Load movies when the page is ready
window.onload = loadMovies;
