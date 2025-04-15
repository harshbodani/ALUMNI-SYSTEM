// Handle image slideshow
const images = ["image1.jpg", "image2.jpg", "image3.jpg"]; // Add your image file paths
let currentImageIndex = 0;

const slideshowImage = document.getElementById("slideshowImage");
setInterval(() => {
    currentImageIndex = (currentImageIndex + 1) % images.length; // Loop through images
    slideshowImage.src = images[currentImageIndex];
}, 3000); // Change image every 3 seconds

// Handle search button click
document.getElementById("searchButton").addEventListener("click", () => {
    const searchQuery = document.getElementById("searchBar").value.trim();
    if (searchQuery) {
        alert(`Searching for alumni with: ${searchQuery}`); // Replace with actual search logic
    } else {
        alert("Please enter a search term.");
    }
});

// Handle view alumni button click
document.getElementById("viewAlumniButton").addEventListener("click", () => {
    window.location.href = "feed.html"; // Replace with the actual alumni details page
});
