const API_KEY = 'Api-key'; 
const API_URL = 'Api';

const imageContainer = document.getElementById('imageContainer');
const imageResultElement = document.getElementById('imageResult');

// Function to generate the image
function generateImage() {
    const promptValue = document.getElementById('prompt').value;
    const styleValue = document.getElementById('dropdownStyles').value;
    const ratioValue = document.getElementById('dropdownRatio').value;

    if (!promptValue) {
        alert('Please enter a prompt.');
        return;
    }

    setLoadingState(true);

    var myheaders = new Headers();
    myheaders.append("Authorization", "Bearer " +  API_KEY );

    const formData = new FormData();
    formData.append('prompt', promptValue);
    formData.append('style', styleValue);
    formData.append('aspect_ratio', ratioValue);

    var requestOptions = {
        method: 'POST',
        headers: myheaders,
        body: formData,
        redirect: 'follow'
    };
    fetch(API_URL, requestOptions)
    .then(response => response.blob())
    .then(blob => {
        const imageUrl = URL.createObjectURL(blob);
        imageResultElement.src = imageUrl;})
    .catch(error => {
        console.error('Error generating image:', error);
        alert('Failed to generate image. Please try again.');
    })
    .finally(() => {
        setLoadingState(false);
    });   
       
}

function setLoadingState(isLoading) {
    if(isLoading) {
        imageResultElement.style.display = 'none';
        imageContainer.classList.add('loading');
    }else {
        imageResultElement.style.display = 'block';
        imageContainer.classList.remove('loading');
    }
}

function downloadImage() {
const imageUrl = imageResultElement.src;
    if (!imageUrl) {
        alert('No image to download. Please generate an image first.');
        return;
    }

    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = 'generated_image.jpg';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

}

// Dark mode functionality
const darkModeToggle = document.getElementById('darkModeToggle');
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
const savedMode = localStorage.getItem('darkMode');

function setDarkMode(on) {
    document.body.classList.toggle('dark-mode', on);
    localStorage.setItem('darkMode', on ? 'on' : 'off');
    // Change icon
    darkModeToggle.innerHTML = on
        ? "<box-icon name='sun'></box-icon>"
        : "<box-icon name='moon'></box-icon>";
}

// Initial mode
if (savedMode === 'on' || (savedMode === null && prefersDark)) {
    setDarkMode(true);
} else {
    setDarkMode(false);
}

darkModeToggle.addEventListener('click', () => {
    setDarkMode(!document.body.classList.contains('dark-mode'));
});

// Random prompt suggestions
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

const suggestPromptBtn = document.getElementById('suggestPromptBtn');
const promptInput = document.getElementById('prompt');

if (suggestPromptBtn && promptInput) {
    suggestPromptBtn.addEventListener('click', () => {
        const randomPrompt = prompts[Math.floor(Math.random() * prompts.length)];
        promptInput.value = randomPrompt;
    });
}