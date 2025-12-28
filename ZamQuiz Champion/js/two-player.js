// Two-player mode functionality for ZamQuiz Champion

document.addEventListener('DOMContentLoaded', function () {
  renderTwoPlayerSubjects();
  loadRecentMatches();
});

// Render two-player subjects dynamically
function renderTwoPlayerSubjects() {
  const container = document.getElementById('two-player-subjects-grid');
  if (!container) return;

  const subjects = getAvailableSubjects();
  container.innerHTML = '';

  subjects.forEach(subject => {
    const card = document.createElement('div');
    card.className = 'glass-card slide-in';
    card.style.textAlign = 'center';
    card.style.cursor = 'pointer';

    card.innerHTML = `
      <div style="font-size: 3rem; margin-bottom: 1rem;">${subject.icon || '🏆'}</div>
      <h3 style="margin-bottom: 0.5rem;">${subject.name}</h3>
      <p style="font-size: 0.9rem; opacity: 0.7; margin-bottom: 1.5rem;">Challenge a friend in ${subject.name}!</p>
      <button onclick="startTwoPlayerGame('${subject.id}')" class="btn btn-green w-full">Start Battle</button>
    `;
    container.appendChild(card);
  });
}

// Start a two-player game
function startTwoPlayerGame(subject) {
  window.location.href = `quiz.html?subject=${subject}&twoPlayer=true&player=1`;
}

// Load recent two-player matches
function loadRecentMatches() {
  const container = document.getElementById('recent-matches-container');
  if (!container) return;

  const history = getTwoPlayerHistory();
  if (history.length === 0) {
    container.innerHTML = '<p style="text-align: center; opacity: 0.6; padding: 2rem;">No recent battles yet. Be the first to start a challenge!</p>';
    return;
  }

  container.innerHTML = `
    <div class="glass-card" style="padding: 0; overflow-x: auto;">
      <table style="width: 100%; border-collapse: collapse; text-align: left;">
        <thead style="opacity: 0.6; font-size: 0.8rem; text-transform: uppercase;">
          <tr>
            <th style="padding: 1rem;">Date</th>
            <th style="padding: 1rem;">Subject</th>
            <th style="padding: 1rem;">Matchup</th>
            <th style="padding: 1rem;">Winner</th>
          </tr>
        </thead>
        <tbody>
          ${history.reverse().slice(0, 5).map(match => `
            <tr style="border-top: 1px solid var(--glass-border);">
              <td style="padding: 1rem; opacity: 0.7;">${new Date(match.date).toLocaleDateString()}</td>
              <td style="padding: 1rem; font-weight: 600;">${match.subject}</td>
              <td style="padding: 1rem;">
                <span style="font-weight: 600;">${match.player1Name}</span> (${match.player1Score}%) vs 
                <span style="font-weight: 600;">${match.player2Name}</span> (${match.player2Score}%)
              </td>
              <td style="padding: 1rem;"><span class="glass-tag" style="background: var(--zambia-green); color: white;">${match.winner}</span></td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;
}