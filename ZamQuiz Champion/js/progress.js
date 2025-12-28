// Progress tracking functionality for ZamQuiz Champion

document.addEventListener('DOMContentLoaded', function () {
  loadProgressData();
});

// Load progress data
function loadProgressData() {
  const container = document.getElementById('progress-container');
  if (!container) return;

  const userData = getUserData();
  const progressData = getProgressData();
  const subjects = getAvailableSubjects();

  if (!userData) {
    container.innerHTML = '<p class="w3-center">No progress data available. Start a quiz!</p>';
    return;
  }

  container.innerHTML = '';

  // Overall Stats Section
  const statsGrid = document.createElement('div');
  statsGrid.className = 'grid';
  statsGrid.style.gridTemplateColumns = 'repeat(auto-fit, minmax(220px, 1fr))';
  statsGrid.style.gap = '1.5rem';
  statsGrid.style.marginBottom = '4rem';

  const createStatCard = (label, value, color, icon) => {
    return `
      <div class="glass-card" style="padding: 2rem; display: flex; align-items: center; gap: 1.5rem; transition: transform 0.2s;">
        <div style="width: 60px; height: 60px; border-radius: 50%; background: ${color}20; display: flex; align-items: center; justify-content: center; font-size: 1.8rem; color: ${color}; flex-shrink: 0;">
          ${icon}
        </div>
        <div>
          <h2 style="margin: 0; font-size: 2.2rem; color: var(--text-main); font-weight: 700; line-height: 1.1;">${value}</h2>
          <p style="margin: 0.2rem 0 0; opacity: 0.6; font-size: 0.85rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em;">${label}</p>
        </div>
      </div>
    `;
  };

  statsGrid.innerHTML = `
    ${createStatCard('Quizzes Completed', userData.quizzesTaken || 0, 'var(--zambia-green)', '📝')}
    ${createStatCard('Best Score', (userData.bestScore || 0) + '%', 'var(--zambia-orange)', '🏆')}
    ${createStatCard('Questions Answered', userData.questionsAnswered || 0, 'var(--accent-blue)', '❓')}
    ${createStatCard('Total Points', userData.totalPoints || 0, 'var(--zambia-red)', '⭐')}
  `;
  container.appendChild(statsGrid);

  // Subject Progress Section
  const subjectsTitle = document.createElement('h3');
  subjectsTitle.style.marginBottom = '2rem';
  subjectsTitle.style.display = 'flex';
  subjectsTitle.style.alignItems = 'center';
  subjectsTitle.style.gap = '10px';
  subjectsTitle.innerHTML = '<span style="font-size: 1.5rem;">📚</span> Subject Mastery';
  container.appendChild(subjectsTitle);

  const subjectsGrid = document.createElement('div');
  subjectsGrid.className = 'grid';
  subjectsGrid.style.gridTemplateColumns = 'repeat(auto-fit, minmax(320px, 1fr))';
  subjectsGrid.style.gap = '2rem';

  const getGrade = (score) => {
    if (score >= 90) return { grade: 'A+', color: 'var(--zambia-green)' };
    if (score >= 80) return { grade: 'A', color: 'var(--zambia-green)' };
    if (score >= 70) return { grade: 'B', color: 'var(--accent-blue)' };
    if (score >= 60) return { grade: 'C', color: 'var(--zambia-orange)' };
    if (score >= 50) return { grade: 'D', color: 'var(--zambia-orange)' };
    return { grade: 'F', color: 'var(--zambia-red)' };
  };

  subjects.forEach(subject => {
    const data = progressData[subject.id] || { highestScore: 0, completed: false };
    const { grade, color } = getGrade(data.highestScore);

    const card = document.createElement('div');
    card.className = 'glass-card';
    card.style.display = 'flex';
    card.style.flexDirection = 'column';
    card.style.padding = '0'; // Reset padding to handle internal layout
    card.style.overflow = 'hidden';

    card.innerHTML = `
      <div style="padding: 2rem;">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 2rem;">
          <div>
            <span style="font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.1em; opacity: 0.6; font-weight: 700;">Subject</span>
            <h4 style="margin: 0.3rem 0 0; font-size: 1.4rem;">${subject.name}</h4>
          </div>
          <div style="width: 50px; height: 50px; background: ${color}; color: white; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 1.5rem; font-weight: 700; box-shadow: 0 4px 12px ${color}40;">
            ${data.highestScore > 0 ? grade : '-'}
          </div>
        </div>

        <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 0.5rem;">
          <span style="font-size: 0.9rem; font-weight: 600;">Proficiency</span>
          <span style="font-size: 1.1rem; font-weight: 700; color: ${color};">${data.highestScore}%</span>
        </div>
        
        <div style="background: rgba(0,0,0,0.05); height: 12px; border-radius: 6px; overflow: hidden;">
          <div style="background: ${color}; height: 100%; width: ${data.highestScore}%; transition: width 1s cubic-bezier(0.4, 0, 0.2, 1);"></div>
        </div>
      </div>

      <div style="background: rgba(0,0,0,0.02); padding: 1.5rem 2rem; border-top: 1px solid var(--glass-border); display: flex; justify-content: space-between; align-items: center;">
         <span style="font-size: 0.85rem; opacity: 0.7;">${data.completed ? 'Completed' : 'Not started yet'}</span>
         <a href="quiz.html?subject=${subject.id}" class="btn" style="padding: 0.5rem 1.2rem; font-size: 0.9rem; background: white; border: 1px solid var(--glass-border); color: var(--text-main);">Practice &rarr;</a>
      </div>
    `;
    subjectsGrid.appendChild(card);
  });
  container.appendChild(subjectsGrid);

  // Two-Player History
  const history = getTwoPlayerHistory();
  if (history && history.length > 0) {
    const historySection = document.createElement('div');
    historySection.style.marginTop = '5rem';
    historySection.innerHTML = `
      <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 2rem;">
        <span style="font-size: 1.5rem;">⚔️</span>
        <h3 style="margin: 0;">Match History</h3>
      </div>
      <div class="glass-card" style="padding: 0; overflow-x: auto; border: 1px solid var(--glass-border);">
        <table style="width: 100%; border-collapse: collapse; min-width: 600px;">
          <thead style="background: rgba(0,0,0,0.03); font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.05em; color: var(--text-muted);">
            <tr>
              <th style="padding: 1.5rem; text-align: left; font-weight: 600;">Date</th>
              <th style="padding: 1.5rem; text-align: left; font-weight: 600;">Subject</th>
              <th style="padding: 1.5rem; text-align: left; font-weight: 600;">Matchup</th>
              <th style="padding: 1.5rem; text-align: center; font-weight: 600;">Score</th>
              <th style="padding: 1.5rem; text-align: right; font-weight: 600;">Result</th>
            </tr>
          </thead>
          <tbody>
            ${history.reverse().slice(0, 10).map(match => `
              <tr style="border-top: 1px solid var(--glass-border); transition: background 0.2s;">
                <td style="padding: 1.5rem; font-size: 0.9rem; opacity: 0.8;">${new Date(match.date).toLocaleDateString()}</td>
                <td style="padding: 1.5rem; font-weight: 600;">${match.subject}</td>
                <td style="padding: 1.5rem;">
                   <div style="display: flex; align-items: center; gap: 8px;">
                     <span style="font-weight: 500;">${match.player1Name}</span>
                     <span style="font-size: 0.8rem; opacity: 0.5;">VS</span>
                     <span style="font-weight: 500;">${match.player2Name}</span>
                   </div>
                </td>
                <td style="padding: 1.5rem; text-align: center;">
                  <span style="background: rgba(0,0,0,0.05); padding: 4px 8px; border-radius: 6px; font-weight: 600; font-size: 0.9rem;">
                    ${match.player1Score}% - ${match.player2Score}%
                  </span>
                </td>
                <td style="padding: 1.5rem; text-align: right;">
                   <span class="glass-tag" style="background: var(--zambia-green); color: white; padding: 6px 12px; border-radius: 20px; font-size: 0.8rem; font-weight: 600;">
                     ${match.winner} Wins
                   </span>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
    container.appendChild(historySection);
  }
}

function handleResetProgress() {
  if (confirm('Are you sure you want to reset all progress? This will clear all rankings and history.')) {
    clearAllData();
    location.reload();
  }
}