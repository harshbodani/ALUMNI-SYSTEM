document.getElementById("loginForm").addEventListener("submit", async function (event) {
    event.preventDefault();

    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;

    try {
        const response = await fetch("http://127.0.0.1:5000/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
        });

        const result = await response.json();

        if (response.ok) {
            alert(result.message); // Display success message
            window.location.href = "dashboard/dashboard.html"; // Redirect to the dashboard
        } else {
            document.getElementById("message").textContent = result.message; // Show error message
        }
    } catch (error) {
        console.error("Error during login:", error);
    }
});
