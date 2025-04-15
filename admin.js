// Fetch Pending Registrations and Display in Table
async function fetchPendingRegistrations() {
    try {
        const response = await fetch('http://127.0.0.1:5000/pending-registrations');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const registrations = await response.json();

        const tableBody = document.getElementById('registrationTableBody');
        tableBody.innerHTML = ''; // Clear the table before populating

        registrations.forEach(registration => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${registration.id}</td>
                <td>${registration.name}</td>
                <td>${registration.email}</td>
                <td>
                    <button class="btn btn-success btn-sm approve-btn" data-id="${registration.id}">Approve</button>
                    <button class="btn btn-danger btn-sm reject-btn" data-id="${registration.id}">Reject</button>
                </td>
            `;
            tableBody.appendChild(row);
        });

        // Attach event listeners to buttons
        document.querySelectorAll('.approve-btn').forEach(button => {
            button.addEventListener('click', () => handleApproval(button.dataset.id));
        });

        document.querySelectorAll('.reject-btn').forEach(button => {
            button.addEventListener('click', () => handleRejection(button.dataset.id));
        });
    } catch (error) {
        console.error('Error fetching pending registrations:', error);
    }
}

// Handle Approve Button Click
async function handleApproval(id) {
    try {
        const response = await fetch(`http://127.0.0.1:5000/approve-registration/${id}`, {
            method: 'POST',
        });
        if (!response.ok) {
            throw new Error('Failed to approve registration');
        }
        alert('Registration approved!');
        fetchPendingRegistrations(); // Refresh the table
    } catch (error) {
        console.error('Error approving registration:', error);
    }
}

// Handle Reject Button Click
async function handleRejection(id) {
    try {
        const response = await fetch(`http://127.0.0.1:5000/reject-registration/${id}`, {
            method: 'POST',
        });
        if (!response.ok) {
            throw new Error('Failed to reject registration');
        }
        alert('Registration rejected!');
        fetchPendingRegistrations(); // Refresh the table
    } catch (error) {
        console.error('Error rejecting registration:', error);
    }
}

// Initial Load
window.onload = fetchPendingRegistrations;
