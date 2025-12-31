// Storage handler for ZamQuiz Champion

const DEFAULT_SUBJECTS = [
  { id: 'math', name: 'Mathematics', desc: 'Test your skills in numbers, algebra, and geometry', icon: 'math-icon' },
  { id: 'science', name: 'Science', desc: 'Explore biology, chemistry, and physics concepts', icon: 'science-icon' },
  { id: 'ict', name: 'ICT', desc: 'Test your knowledge of computers and technology', icon: 'ict-icon' },
  { id: 'civics', name: 'Civics', desc: 'Learn about citizenship and Zambian governance', icon: 'civics-icon' }
];

// Function to get available subjects
function getAvailableSubjects() {
  const subjects = localStorage.getItem('availableSubjects');
  return subjects ? JSON.parse(subjects) : DEFAULT_SUBJECTS;
}

// Function to add a subject
function addSubject(id, name, desc, icon = 'default-icon') {
  const subjects = getAvailableSubjects();
  if (subjects.find(s => s.id === id)) return false;

  subjects.push({ id, name, desc, icon });
  localStorage.setItem('availableSubjects', JSON.stringify(subjects));
  return true;
}

// Function to remove a subject
function removeSubject(id) {
  let subjects = getAvailableSubjects();
  subjects = subjects.filter(s => s.id !== id);
  localStorage.setItem('availableSubjects', JSON.stringify(subjects));

  // Also clean up leaderboard and results if needed? 
  // For now just removing from available list
  return true;
}

// Function to get current user data
function getUserData() {
  const userData = localStorage.getItem('currentUser');
  return userData ? JSON.parse(userData) : null;
}

// Function to update user data
function updateUserData(userData) {
  localStorage.setItem('currentUser', JSON.stringify(userData));
}

// Save quiz result to localStorage
function saveQuizResult(subject, score, totalQuestions, playerName = 'Guest') {
  // Get current user data
  let userData = getUserData();

  // If player name is provided, update the local user session
  if (playerName !== 'Guest') {
    userData.name = playerName;
  }

  // Calculate percentage score
  const percentage = Math.round((score / totalQuestions) * 100);

  // Update user statistics
  userData.quizzesTaken += 1;
  userData.questionsAnswered += totalQuestions;
  userData.totalPoints += score;

  // Update subject specific data
  if (!userData.subjects) userData.subjects = {};
  if (!userData.subjects[subject]) {
    userData.subjects[subject] = {
      highestScore: 0,
      completed: false
    };
  }

  // Update highest score if current score is higher
  if (percentage > userData.subjects[subject].highestScore) {
    userData.subjects[subject].highestScore = percentage;
  }

  // Mark subject as completed
  userData.subjects[subject].completed = true;

  // Update best overall score if current score is higher
  if (percentage > userData.bestScore) {
    userData.bestScore = percentage;
  }

  // Save updated user data
  updateUserData(userData);

  // Add to leaderboard
  addToLeaderboard(subject, playerName, percentage);

  return true;
}

// Get leaderboard for a specific subject
function getLeaderboard(subject) {
  const leaderboardKey = `leaderboard_${subject}`;
  const leaderboard = localStorage.getItem(leaderboardKey);
  return leaderboard ? JSON.parse(leaderboard) : [];
}

// Add score to leaderboard
function addToLeaderboard(subject, name, score) {
  const leaderboardKey = `leaderboard_${subject}`;
  let leaderboard = getLeaderboard(subject);

  // Add new score
  leaderboard.push({
    name: name,
    score: score,
    date: new Date().toISOString()
  });

  // Sort by score (descending)
  leaderboard.sort((a, b) => b.score - a.score);

  // Keep only top 10 scores
  leaderboard = leaderboard.slice(0, 10);

  // Save updated leaderboard
  localStorage.setItem(leaderboardKey, JSON.stringify(leaderboard));
}

// Reset leaderboard for a specific subject
function resetLeaderboard(subject) {
  const leaderboardKey = `leaderboard_${subject}`;
  localStorage.setItem(leaderboardKey, JSON.stringify([]));
}

// Reset all leaderboards
function resetAllLeaderboards() {
  const subjects = getAvailableSubjects();
  subjects.forEach(s => resetLeaderboard(s.id));
  resetLeaderboard('all');
}

// Get progress data for all subjects
function getProgressData() {
  const userData = getUserData();
  return userData ? userData.subjects : null;
}

// Save player scores for two-player mode
function saveTwoPlayerScores(subject, player1Name, player2Name, player1Score, player2Score, totalQuestions) {
  const player1Percentage = Math.round((player1Score / totalQuestions) * 100);
  const player2Percentage = Math.round((player2Score / totalQuestions) * 100);

  // Save to localStorage
  const twoPlayerHistory = JSON.parse(localStorage.getItem('twoPlayerHistory') || '[]');

  twoPlayerHistory.push({
    subject: subject,
    player1Name: player1Name,
    player2Name: player2Name,
    player1Score: player1Percentage,
    player2Score: player2Percentage,
    date: new Date().toISOString()
  });

  // Keep only latest 10 matches
  if (twoPlayerHistory.length > 10) {
    twoPlayerHistory.shift();
  }

  localStorage.setItem('twoPlayerHistory', JSON.stringify(twoPlayerHistory));

  return {
    player1Percentage,
    player2Percentage,
    winner: player1Percentage > player2Percentage ? player1Name :
      player2Percentage > player1Percentage ? player2Name : 'Tie'
  };
}

// Get two-player history
function getTwoPlayerHistory() {
  return JSON.parse(localStorage.getItem('twoPlayerHistory') || '[]');
}

// Clear all stored data (for testing)
function clearAllData() {
  localStorage.removeItem('currentUser');
  localStorage.removeItem('availableSubjects');
  localStorage.removeItem('twoPlayerHistory');
  localStorage.removeItem('zamquiz_auto_backup');
  // Clear all leaderboard and question keys
  const keysToRemove = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && (key.startsWith('leaderboard_') || key.startsWith('questions_'))) {
      keysToRemove.push(key);
    }
  }
  keysToRemove.forEach(key => localStorage.removeItem(key));
}

// Initialize default data if nothing exists
function initializeDefaultData() {
  // First try to restore from auto-backup
  const hasBackup = restoreFromAutoBackup();

  if (!hasBackup) {
    // Check if subjects exist
    if (!localStorage.getItem('availableSubjects')) {
      localStorage.setItem('availableSubjects', JSON.stringify(DEFAULT_SUBJECTS));
    }

    // Check if user data exists
    if (!localStorage.getItem('currentUser')) {
      const subjectsList = getAvailableSubjects();
      const subjectStats = {};
      subjectsList.forEach(s => {
        subjectStats[s.id] = { highestScore: 0, completed: false };
      });

      const defaultUser = {
        name: 'Guest',
        quizzesTaken: 0,
        totalPoints: 0,
        questionsAnswered: 0,
        bestScore: 0,
        subjects: subjectStats
      };

      localStorage.setItem('currentUser', JSON.stringify(defaultUser));
    }
  }

  // Create initial backup
  createAutoBackup();
}

// ============================================
// AUTO-BACKUP SYSTEM
// ============================================

// Create auto-backup of all data
function createAutoBackup() {
  const backup = {};

  // Backup all localStorage data
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key !== 'zamquiz_auto_backup') {
      backup[key] = localStorage.getItem(key);
    }
  }

  // Add timestamp
  backup._backupTimestamp = new Date().toISOString();
  backup._backupVersion = '1.0';

  // Store backup in localStorage (different key)
  try {
    localStorage.setItem('zamquiz_auto_backup', JSON.stringify(backup));
  } catch (e) {
    console.warn('Auto-backup failed:', e);
  }

  return backup;
}

// Restore from auto-backup
function restoreFromAutoBackup() {
  try {
    const backupStr = localStorage.getItem('zamquiz_auto_backup');
    if (!backupStr) return false;

    const backup = JSON.parse(backupStr);
    if (!backup || !backup._backupTimestamp) return false;

    // Restore all keys from backup
    for (const key in backup) {
      if (key.startsWith('_')) continue; // Skip metadata
      if (!localStorage.getItem(key)) {
        localStorage.setItem(key, backup[key]);
      }
    }

    return true;
  } catch (e) {
    console.warn('Restore from backup failed:', e);
    return false;
  }
}

// Trigger auto-backup (call this after any data change)
function triggerAutoBackup() {
  // Debounce backup - wait 2 seconds after last change
  if (window._autoBackupTimeout) {
    clearTimeout(window._autoBackupTimeout);
  }
  window._autoBackupTimeout = setTimeout(() => {
    createAutoBackup();
  }, 2000);
}

// Override localStorage.setItem to auto-backup on changes
const originalSetItem = localStorage.setItem.bind(localStorage);
localStorage.setItem = function (key, value) {
  originalSetItem(key, value);
  // Trigger backup for app-related keys (not the backup itself)
  if (key !== 'zamquiz_auto_backup' && key !== 'teacherLoggedIn') {
    triggerAutoBackup();
  }
};

// Export backup as downloadable file
function downloadBackup() {
  const backup = createAutoBackup();
  const jsonStr = JSON.stringify(backup, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = `zamquiz_backup_${new Date().toISOString().slice(0, 10)}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// Initialize default data when this script loads
initializeDefaultData();