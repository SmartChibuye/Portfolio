// Main JavaScript file for ZamQuiz Champion

// Global variables
let currentUser = getUserData();
let selectedSubject = null;

// Initialize when document is fully loaded
document.addEventListener('DOMContentLoaded', function () {
  // Initialize default data if not exists (via storage.js)

  // Update stats on homepage if those elements exist
  updateHomeStats();

  // Render subjects if grid exists
  const subjectsGrid = document.getElementById('subjects-grid');
  if (subjectsGrid) {
    renderSubjects(subjectsGrid);
  }

  // Setup Quiz of the Day button
  const quizOfDayBtn = document.getElementById('quiz-of-day');
  if (quizOfDayBtn) {
    quizOfDayBtn.addEventListener('click', startQuizOfDay);
  }

  // Initialize rotating quotes if on homepage
  const quoteElement = document.getElementById('motivational-quote');
  if (quoteElement) {
    rotateQuotes(quoteElement);
  }

  // Setup Name Modal events
  setupNameModal();

  // Setup mobile menu
  setupMobileMenu();
});

// Setup mobile menu toggle
function setupMobileMenu() {
  const menuBtn = document.querySelector('.mobile-menu-btn');
  const navLinks = document.querySelector('.nav-links');

  if (menuBtn && navLinks) {
    menuBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      menuBtn.classList.toggle('active');
      navLinks.classList.toggle('active');
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (navLinks.classList.contains('active') && !navLinks.contains(e.target) && !menuBtn.contains(e.target)) {
        menuBtn.classList.remove('active');
        navLinks.classList.remove('active');
      }
    });

    // Close menu when a link is clicked
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        menuBtn.classList.remove('active');
        navLinks.classList.remove('active');
      });
    });
  }
}

// Setup Name Modal events
function setupNameModal() {
  const modal = document.getElementById('name-modal');
  const confirmBtn = document.getElementById('confirm-name');
  const cancelBtn = document.getElementById('cancel-quiz');
  const nameInput = document.getElementById('player-name-input');

  if (!modal) return;

  confirmBtn.addEventListener('click', () => {
    const name = nameInput.value.trim();
    if (name) {
      // Store name in user data for this session
      const userData = getUserData();
      userData.name = name;
      updateUserData(userData);

      // Navigate to quiz
      window.location.href = `pages/quiz.html?subject=${selectedSubject}`;
    } else {
      alert("Please enter your name!");
    }
  });

  cancelBtn.addEventListener('click', () => {
    modal.style.display = 'none';
  });

  // Close modal on escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.style.display === 'flex') {
      modal.style.display = 'none';
    }
  });
}

// Show name prompt before starting quiz
function promptName(subjectId) {
  selectedSubject = subjectId;
  const modal = document.getElementById('name-modal');
  const nameInput = document.getElementById('player-name-input');

  // Pre-fill if name already exists
  const userData = getUserData();
  if (userData && userData.name && userData.name !== 'Guest') {
    nameInput.value = userData.name;
  }

  modal.style.display = 'flex';
  nameInput.focus();
}

// Render dynamic subjects
function renderSubjects(container) {
  const subjects = getAvailableSubjects();
  container.innerHTML = '';

  subjects.forEach(subject => {
    const card = document.createElement('div');
    card.className = 'glass-card';
    card.style.display = 'flex';
    card.style.flexDirection = 'column';
    card.style.alignItems = 'center';
    card.style.textAlign = 'center';

    card.innerHTML = `
      <div class="subject-icon ${subject.icon || 'default-icon'}" style="width: 80px; height: 80px; margin-bottom: 1rem; background: var(--glass-bg); border-radius: 50%; display: flex; align-items: center; justify-content: center;">
         <!-- Placeholder for icons -->
         <span style="font-size: 2rem;">📚</span>
      </div>
      <h3>${subject.name}</h3>
      <p style="flex-grow: 1; opacity: 0.8; margin-bottom: 1.5rem;">${subject.desc}</p>
      <button onclick="promptName('${subject.id}')" class="btn btn-green w-full">Start Quiz</button>
    `;
    container.appendChild(card);
  });
}

// Update home page statistics
function updateHomeStats() {
  const quizzesTaken = document.getElementById('quizzes-taken');
  const bestScore = document.getElementById('best-score');
  const questionsAnswered = document.getElementById('questions-answered');
  const totalPoints = document.getElementById('total-points');

  if (!quizzesTaken || !bestScore || !questionsAnswered || !totalPoints) {
    return; // Not on homepage
  }

  const userData = getUserData();

  if (userData) {
    quizzesTaken.textContent = userData.quizzesTaken || 0;
    bestScore.textContent = (userData.bestScore || 0) + '%';
    questionsAnswered.textContent = userData.questionsAnswered || 0;
    totalPoints.textContent = userData.totalPoints || 0;
  }
}

// Start Quiz of the Day
function startQuizOfDay() {
  const subjects = getAvailableSubjects();
  const randomSubject = subjects[Math.floor(Math.random() * subjects.length)];

  // Store that this is Quiz of the Day
  sessionStorage.setItem('quizOfDay', 'true');

  // Prompt for name first
  promptName(randomSubject.id);
}

// Array of motivational quotes
const quotes = [
  "Education is the most powerful weapon which you can use to change the world. - Nelson Mandela",
  "The more that you read, the more things you will know. The more that you learn, the more places you'll go. - Dr. Seuss",
  "Learning is a treasure that will follow its owner everywhere. - Chinese Proverb",
  "Education is not preparation for life; education is life itself. - John Dewey",
  "Knowledge is power. Information is liberating. Education is the premise of progress. - Kofi Annan",
  "The beautiful thing about learning is that no one can take it away from you. - B.B. King",
  "Education is not the filling of a pail, but the lighting of a fire. - W.B. Yeats",
  "The roots of education are bitter, but the fruit is sweet. - Aristotle",
  "You are always a student, never a master. You have to keep moving forward. - Conrad Hall",
  "Learning never exhausts the mind. - Leonardo da Vinci"
];

// Function to rotate quotes
function rotateQuotes(element) {
  let currentQuoteIndex = 0;

  // Set initial quote
  element.textContent = quotes[currentQuoteIndex];

  // Rotate quotes every 10 seconds
  setInterval(() => {
    currentQuoteIndex = (currentQuoteIndex + 1) % quotes.length;

    // Fade out
    element.style.opacity = 0;

    // Change text and fade in after transition
    setTimeout(() => {
      element.textContent = quotes[currentQuoteIndex];
      element.style.opacity = 0.8;
    }, 500);
  }, 10000);

  // Set initial opacity and transition
  element.style.transition = 'opacity 0.5s ease';
  element.style.opacity = 0.8;
}

// Format time (seconds) to MM:SS
function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
}

// Get query parameters from URL
function getQueryParam(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}