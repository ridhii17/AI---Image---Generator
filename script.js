// script.js (Frontend)

const API_URL = "http://localhost:5000/generate-image"; // ✅ Backend endpoint

const imageContainer = document.getElementById("imageContainer");
const imageResultElement = document.getElementById("imageResult");

// Function to generate the image
function generateImage() {
  const promptValue = document.getElementById("prompt").value;
  const styleValue = document.getElementById("dropdownStyles").value;
  const ratioValue = document.getElementById("dropdownRatio").value;

  if (!promptValue) {
    alert("Please enter a prompt.");
    return;
  }

  setLoadingState(true);

  fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      prompt: `${promptValue}, style: ${styleValue}, aspect ratio: ${ratioValue}`,
    }),
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.imageUrl) {
        imageResultElement.src = data.imageUrl;
      } else {
        alert("Failed to generate image.");
      }
    })
    .catch((error) => {
      console.error("Error generating image:", error);
      alert("Failed to generate image. Please try again.");
    })
    .finally(() => {
      setLoadingState(false);
    });
}

// Set loading state
function setLoadingState(isLoading) {
  if (isLoading) {
    imageResultElement.style.display = "none";
    imageContainer.classList.add("loading");
  } else {
    imageResultElement.style.display = "block";
    imageContainer.classList.remove("loading");
  }
}

// Download generated image
function downloadImage() {
  const imageUrl = imageResultElement.src;
  if (!imageUrl) {
    alert("No image to download. Please generate an image first.");
    return;
  }

  const link = document.createElement("a");
  link.href = imageUrl;
  link.download = "generated_image.jpg";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// Dark mode functionality
const darkModeToggle = document.getElementById("darkModeToggle");
const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
const savedMode = localStorage.getItem("darkMode");

function setDarkMode(on) {
  document.body.classList.toggle("dark-mode", on);
  localStorage.setItem("darkMode", on ? "on" : "off");
  // Change icon
  darkModeToggle.innerHTML = on
    ? "<box-icon name='sun'></box-icon>"
    : "<box-icon name='moon'></box-icon>";
}

// Initial mode
if (savedMode === "on" || (savedMode === null && prefersDark)) {
  setDarkMode(true);
} else {
  setDarkMode(false);
}

darkModeToggle.addEventListener("click", () => {
  setDarkMode(!document.body.classList.contains("dark-mode"));
});

// ✅ Random prompt suggestions
const prompts = [
  "A magic forest with glowing plants and fairy homes among giant mushrooms.",
  "An old steampunk airship floating through golden clouds at sunset.",
  "A future Mars colony with glass domes and gardens against red mountains.",
  "A dragon sleeping on gold coins in a crystal cave.",
  "An underwater kingdom with merpeople and glowing coral buildings.",
  "A floating island with waterfalls pouring into clouds below.",
  "A witch's cottage in fall with magic herbs in the garden.",
  "A robot painting in a sunny studio with art supplies around it.",
  "A magical library with floating glowing books and spiral staircases.",
  "A Japanese shrine during cherry blossom season with lanterns and misty mountains.",
  "A cosmic beach with glowing sand and an aurora in the night sky.",
  "A medieval marketplace with colorful tents and street performers.",
  "A cyberpunk city with neon signs and flying cars at night.",
  "A peaceful bamboo forest with a hidden ancient temple.",
  "A giant turtle carrying a village on its back in the ocean.",
];

document.addEventListener("DOMContentLoaded", () => {
  const suggestPromptBtn = document.getElementById("suggestPromptBtn");
  const promptInput = document.getElementById("prompt");

  if (suggestPromptBtn && promptInput) {
    suggestPromptBtn.addEventListener("click", () => {
      const randomPrompt =
        prompts[Math.floor(Math.random() * prompts.length)];
      promptInput.value = randomPrompt;
    });
  }
});
