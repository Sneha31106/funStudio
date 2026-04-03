import './style.css'

// -- CURSOR GLOW --
const cursorGlow = document.getElementById('cursor-glow');
if (cursorGlow) {
  document.addEventListener('mousemove', (e) => {
    cursorGlow.style.opacity = '1';
    requestAnimationFrame(() => {
      cursorGlow.style.left = `${e.clientX}px`;
      cursorGlow.style.top = `${e.clientY}px`;
    });
  });

  document.addEventListener('mouseleave', () => {
    cursorGlow.style.opacity = '0';
  });
}

// -- FLOATING SPARKLES --
const createSparkles = () => {
  const colors = [
    'rgba(255, 182, 193, 0.9)', // baby pink
    'rgba(144, 238, 144, 0.9)', // light green
    'rgba(224, 224, 230, 0.9)'  // shiny silver
  ];
  const sparkleCount = 40;

  for (let i = 0; i < sparkleCount; i++) {
    const sparkle = document.createElement('div');
    sparkle.classList.add('sparkle');

    const size = Math.random() * 12 + 6; // 6px to 18px
    const left = Math.random() * 100; // 0 to 100vw
    const duration = Math.random() * 15 + 10; // 10s to 25s
    const delay = Math.random() * 20;

    sparkle.style.color = colors[Math.floor(Math.random() * colors.length)];
    sparkle.style.width = `${size}px`;
    sparkle.style.height = `${size}px`;
    sparkle.style.left = `${left}vw`;
    sparkle.style.animationDuration = `${duration}s, 4s`;
    sparkle.style.animationDelay = `${delay}s, ${Math.random() * 4}s`;

    document.body.appendChild(sparkle);
  }
};
createSparkles();

// -- UTILS --
const showLoading = (elementId) => {
  const el = document.getElementById(elementId);
  el.innerHTML = '<div class="loading-spinner"></div>';
};

const showError = (elementId, message) => {
  const el = document.getElementById(elementId);
  el.innerHTML = `<span class="error-text">Error: ${message}</span>`;
};

// ============================================
// 1. Dog Finder
// ============================================
let currentDogUrl = '';

const fetchDog = async () => {
  const displayEl = 'dog-display';
  showLoading(displayEl);

  try {
    const res = await fetch('https://dog.ceo/api/breeds/image/random');
    if (!res.ok) throw new Error('Failed to fetch dog image');
    const data = await res.json();

    currentDogUrl = data.message;

    // Extract breed from URL (format: /breeds/breed-name/...)
    const breedMatch = currentDogUrl.match(/breeds\/([^/]+)/);
    let breedName = 'Unknown Breed';
    if (breedMatch && breedMatch[1]) {
      breedName = breedMatch[1].replace('-', ' ');
      // Capitalize first letter of each word
      breedName = breedName.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    }

    const container = document.getElementById(displayEl);
    container.innerHTML = `
      <img src="${currentDogUrl}" alt="${breedName}" class="dog-image" />
      <span class="breed-label">${breedName}</span>
    `;

    // Show copy button
    document.getElementById('btn-dog-copy').style.display = 'inline-block';

  } catch (error) {
    showError(displayEl, 'Could not retrieve a dog image at this moment.');
  }
};

const copyDogUrl = async () => {
  if (!currentDogUrl) return;
  try {
    await navigator.clipboard.writeText(currentDogUrl);
    const btn = document.getElementById('btn-dog-copy');
    const originalText = btn.innerText;
    btn.innerText = 'Copied!';
    setTimeout(() => { btn.innerText = originalText; }, 2000);
  } catch (err) {
    console.error('Failed to copy text: ', err);
  }
};

document.getElementById('btn-dog').addEventListener('click', fetchDog);
document.getElementById('btn-dog-copy').addEventListener('click', copyDogUrl);


// ============================================
// 2. Joke Generator
// ============================================
const fetchJoke = async () => {
  const displayEl = 'joke-display';
  showLoading(displayEl);

  try {
    const res = await fetch('https://official-joke-api.appspot.com/random_joke');
    if (!res.ok) throw new Error('Failed to fetch joke');
    const data = await res.json();

    const container = document.getElementById(displayEl);
    container.innerHTML = `
      <div class="joke-text">
        <p class="joke-setup">${data.setup}</p>
        <p class="joke-punchline">${data.punchline}</p>
      </div>
    `;

    document.getElementById('btn-joke-next').style.display = 'inline-block';
    // Hide the primary button and replace functionality with the secondary button
    document.getElementById('btn-joke').style.display = 'none';

  } catch (error) {
    showError(displayEl, 'Humor logic offline.');
  }
};

document.getElementById('btn-joke').addEventListener('click', fetchJoke);
document.getElementById('btn-joke-next').addEventListener('click', fetchJoke);


// ============================================
// 3. Random User Profile
// ============================================
const fetchUser = async () => {
  const displayEl = 'user-display';
  showLoading(displayEl);

  try {
    const res = await fetch('https://randomuser.me/api/');
    if (!res.ok) throw new Error('Failed to fetch user');
    const data = await res.json();

    const user = data.results[0];
    const fullName = `${user.name.first} ${user.name.last}`;

    const container = document.getElementById(displayEl);
    container.innerHTML = `
      <img src="${user.picture.large}" alt="${fullName}" class="user-avatar" />
      <h3 class="user-name">${fullName}</h3>
      <p class="user-detail">${user.email}</p>
      <p class="user-detail">${user.location.country} • Age: ${user.dob.age}</p>
      <p class="user-detail">${user.phone}</p>
    `;

  } catch (error) {
    showError(displayEl, 'Could not retrieve an identity profile.');
  }
};

document.getElementById('btn-user').addEventListener('click', fetchUser);


// ============================================
// 4. Data Explorer (JSONPlaceholder)
// ============================================
const fetchPost = async () => {
  const displayEl = 'post-display';
  showLoading(displayEl);

  try {
    // Fetch a random post between 1 and 100
    const randomId = Math.floor(Math.random() * 100) + 1;
    const res = await fetch(`https://jsonplaceholder.typicode.com/posts/${randomId}`);
    if (!res.ok) throw new Error('Failed to fetch data');
    const data = await res.json();

    const container = document.getElementById(displayEl);
    container.innerHTML = `
      <div class="post-text">
        <span class="post-id">Artifact #${data.id} • Post</span>
        <h4 class="post-title">${data.title}</h4>
        <p class="post-body">${data.body}</p>
      </div>
    `;

  } catch (error) {
    showError(displayEl, 'Data fetch failed.');
  }
};

document.getElementById('btn-post').addEventListener('click', fetchPost);
