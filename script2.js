document.addEventListener('DOMContentLoaded', function () {
  const toggleButton = document.getElementById('togglePassword');
  const passwordInput = document.getElementById('password');
  const toggleIcon = toggleButton.querySelector('i');

  toggleButton.addEventListener('click', function () {
    if (passwordInput.type === 'password') {
      passwordInput.type = 'text';
      toggleIcon.className = 'ri-eye-off-line text-gray-400 hover:text-primary transition-colors';
    } else {
      passwordInput.type = 'password';
      toggleIcon.className = 'ri-eye-line text-gray-400 hover:text-primary transition-colors';
    }
  });

  const form = document.getElementById('loginForm');
  const usernameInput = document.getElementById('username');
  const passwordInputField = document.getElementById('password');

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    const username = usernameInput.value.trim();
    const password = passwordInputField.value.trim();

    if (!username || !password) {
      showError('Please fill in all fields');
      return;
    }

    showSuccess('Authenticating...');

    fetch('/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, password })
    })
    .then(res => res.json())
    .then(data => {
      removeExistingMessages();
      if (data.success) {
        showSuccess(data.message);
        setTimeout(() => {
          window.location.href = 'adminpannel.html'; // Redirect after successful login
        }, 1500);
      } else {
        showError(data.message || 'Login failed');
      }
    })
    .catch(() => {
      showError('Could not connect to server. Try again later.');
    });
  });

  function showError(message) {
    removeExistingMessages();
    const errorDiv = document.createElement('div');
    errorDiv.className = 'bg-red-500/20 border border-red-500 text-red-200 px-4 py-2 rounded-lg text-sm mt-4';
    errorDiv.textContent = message;
    form.appendChild(errorDiv);
    setTimeout(() => {
      errorDiv.remove();
    }, 3000);
  }

  function showSuccess(message) {
    removeExistingMessages();
    const successDiv = document.createElement('div');
    successDiv.className = 'bg-green-500/20 border border-green-500 text-green-200 px-4 py-2 rounded-lg text-sm mt-4';
    successDiv.textContent = message;
    form.appendChild(successDiv);
  }

  function removeExistingMessages() {
    const existingMessages = form.querySelectorAll('.bg-red-500\\/20, .bg-green-500\\/20');
    existingMessages.forEach(msg => msg.remove());
  }

  // Input focus ring effect
  const inputs = document.querySelectorAll('input[type="text"], input[type="password"]');
  inputs.forEach(input => {
    input.addEventListener('focus', function () {
      this.parentElement.classList.add('ring-2', 'ring-primary/20');
    });

    input.addEventListener('blur', function () {
      this.parentElement.classList.remove('ring-2', 'ring-primary/20');
    });
  });
});

