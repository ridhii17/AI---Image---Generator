// Frontend/script.js

const API_URL = "http://localhost:5000/generate-image"; // backend URL

const imageContainer = document.getElementById("imageContainer");
const imageResultElement = document.getElementById("imageResult");

// Function to generate the image
async function generateImage() {
  const promptValue = document.getElementById("prompt").value;
  const styleValue = document.getElementById("dropdownStyles").value;
  const ratioValue = document.getElementById("dropdownRatio").value;

  if (!promptValue) {
    alert("Please enter a prompt.");
    return;
  }

  setLoadingState(true);

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        prompt: `${promptValue}, style: ${styleValue}, aspect ratio: ${ratioValue}`,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Failed to generate image");
    }

    imageResultElement.src = data.imageUrl;
  } catch (error) {
    console.error("❌ Error generating image:", error);
    alert("Failed to generate image. Check console for details.");
  } finally {
    setLoadingState(false);
  }
}

function setLoadingState(isLoading) {
  if (isLoading) {
    imageResultElement.style.display = "none";
    imageContainer.classList.add("loading");
  } else {
    imageResultElement.style.display = "block";
    imageContainer.classList.remove("loading");
  }
}

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

// Random prompt suggestions
const prompts = [
  "A magic forest with glowing plants and fairy homes among giant mushrooms.",
  "An old steampunk airship floating through golden clouds at sunset.",
  "A future Mars colony with glass domes and gardens against red mountains.",
  "A dragon sleeping on gold coins in a crystal cave.",
  "An underwater kingdom with merpeople and glowing coral buildings.",
  "A floating island with waterfalls pouring into clouds below.",
];

const suggestPromptBtn = document.getElementById("suggestPromptBtn");
const promptInput = document.getElementById("prompt");

if (suggestPromptBtn && promptInput) {
  suggestPromptBtn.addEventListener("click", () => {
    const randomPrompt = prompts[Math.floor(Math.random() * prompts.length)];
    promptInput.value = randomPrompt;
  });
}
