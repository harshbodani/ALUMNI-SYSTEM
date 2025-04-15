// Handle Post Creation
document.getElementById("postForm").addEventListener("submit", async (event) => {
  event.preventDefault();

  const postText = document.getElementById("postText").value;
  const postImage = document.getElementById("postImage").files[0];

  if (!postText && !postImage) {
    alert("Please provide either text or an image.");
    return;
  }

  const formData = new FormData();
  formData.append("text", postText);
  if (postImage) formData.append("image", postImage);

  try {
    const response = await fetch("http://127.0.0.1:5000/post", {
      method: "POST",
      body: formData,
    });

    if (response.ok) {
      alert("Post created successfully!");
      loadPosts();  // Reload posts after successful submission
    } else {
      alert("Failed to create post!");
    }
  } catch (error) {
    console.error("Error:", error);
  }
});

// Handle Search Filter
document.getElementById("searchForm").addEventListener("submit", async (event) => {
  event.preventDefault();

  const filterValue = document.getElementById("achievementFilter").value;
  
  if (!filterValue) {
    alert("Please select an achievement type.");
    return;
  }

  try {
    const response = await fetch(`http://127.0.0.1:5000/posts?filter=${filterValue}`);
    const posts = await response.json();
    const postFeed = document.getElementById("postFeed");

    postFeed.innerHTML = '';
    posts.forEach(post => {
      const postElement = document.createElement("div");
      postElement.classList.add("post");

      const userElement = document.createElement("h3");
      userElement.textContent = post.user_name;

      const textElement = document.createElement("p");
      textElement.textContent = post.text;

      if (post.image_url) {
        const imageElement = document.createElement("img");
        imageElement.src = post.image_url;
        postElement.appendChild(imageElement);
      }

      postElement.appendChild(userElement);
      postElement.appendChild(textElement);

      postFeed.appendChild(postElement);
    });
  } catch (error) {
    console.error("Error:", error);
  }
});

// Load posts when page loads
window.onload = loadPosts;
