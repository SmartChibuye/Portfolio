// Home page specific JavaScript for ZamQuiz Champion

document.addEventListener('DOMContentLoaded', function() {
  // Update stats on the home page
  updateHomePageStats();
});

// Function to update home page statistics
function updateHomePageStats() {
  // Check if we're on the home page
  if (!document.getElementById('quizzes-taken')) {
    return;
  }
  
  // Get user data
  const userData = getUserData();
  
  if (!userData) {
    return;
  }
  
  // Update stats with animation
  animateCounter('quizzes-taken', 0, userData.quizzesTaken, 1000);
  animateCounter('best-score', 0, userData.bestScore, 1000, '%');
  animateCounter('questions-answered', 0, userData.questionsAnswered, 1000);
  animateCounter('total-points', 0, userData.totalPoints, 1000);
}

// Animate counter from start to end value
function animateCounter(elementId, start, end, duration, suffix = '') {
  const element = document.getElementById(elementId);
  if (!element) return;
  
  const range = end - start;
  const startTime = performance.now();
  
  function updateCounter(currentTime) {
    const elapsedTime = currentTime - startTime;
    
    if (elapsedTime > duration) {
      element.textContent = end + suffix;
      return;
    }
    
    const progress = elapsedTime / duration;
    const currentValue = Math.floor(start + progress * range);
    element.textContent = currentValue + suffix;
    
    requestAnimationFrame(updateCounter);
  }
  
  requestAnimationFrame(updateCounter);
}