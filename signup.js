async function registerUser() {
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const role = document.getElementById('role').value;
    const expertise = document.getElementById('expertise').value;  // Get the expertise value
  
    try {
      const response = await fetch('http://127.0.0.1:5000/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, email, password, role, expertise })  // Include expertise in the request
      });
  
      if (response.ok) {
        const result = await response.json();
        alert(result.message);  // Display success message
      } else {
        alert('Failed to register. Please try again.');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }
  