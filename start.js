// Show login and register sections dynamically
document.getElementById('showLogin').addEventListener('click', () => {
    document.getElementById('welcome').classList.add('hidden');
    document.getElementById('login').classList.remove('hidden');
});

document.getElementById('showRegister').addEventListener('click', () => {
    document.getElementById('welcome').classList.add('hidden');
    document.getElementById('register').classList.remove('hidden');
});

// Back buttons to return to the welcome page
document.getElementById('backToWelcomeLogin').addEventListener('click', () => {
    document.getElementById('login').classList.add('hidden');
    document.getElementById('welcome').classList.remove('hidden');
});

document.getElementById('backToWelcomeRegister').addEventListener('click', () => {
    document.getElementById('register').classList.add('hidden');
    document.getElementById('welcome').classList.remove('hidden');
});

// Registration form submission
document.getElementById('registerForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('registerName').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    const role = document.getElementById('registerRole').value;
    const expertise = document.getElementById('registerExpertise').value;
    

    const response = await fetch('/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, role, expertise })
    });
    const data = await response.json();
    alert(data.message);

    // Redirect to login page after registration
    if (response.status === 201) {
        document.getElementById('register').classList.add('hidden');
        document.getElementById('login').classList.remove('hidden');
    }
});

// Login form submission
document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    const response = await fetch('/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    });
    const data = await response.json();
    alert(data.message);

    // After successful login
    if (response.status === 200) {
        alert("Welcome to the platform!");
        // Redirect or load another page here
    }
});
