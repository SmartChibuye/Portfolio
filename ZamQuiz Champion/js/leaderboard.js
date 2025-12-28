// Leaderboard functionality for ZamQuiz Champion

document.addEventListener('DOMContentLoaded', function () {
  renderSubjectTabs();
  loadLeaderboard('all');
});

// Render subject tabs dynamically
function renderSubjectTabs() {
  const container = document.getElementById('subject-tabs-container');
  if (!container) return;

  const subjects = getAvailableSubjects();
  container.innerHTML = '<button class="subject-tab active-tab" data-subject="all">All Subjects</button>';

  subjects.forEach(subject => {
    const btn = document.createElement('button');
    btn.className = 'subject-tab';
    btn.setAttribute('data-subject', subject.id);
    btn.textContent = subject.name;
    container.appendChild(btn);
  });

  // Add click events
  const tabs = container.querySelectorAll('.subject-tab');
  tabs.forEach(tab => {
    tab.addEventListener('click', function () {
      tabs.forEach(t => t.classList.remove('active-tab'));
      this.classList.add('active-tab');
      loadLeaderboard(this.getAttribute('data-subject'));
    });
  });
}

// Load leaderboard data
function loadLeaderboard(subjectId) {
  const table = document.getElementById('leaderboard-table');
  const title = document.getElementById('leaderboard-title');
  if (!table || !title) return;

  const subjects = getAvailableSubjects();
  const subjectName = subjectId === 'all' ? 'All Subjects' : (subjects.find(s => s.id === subjectId)?.name || subjectId);
  title.textContent = `${subjectName} Leaderboard`;

  let leaderboard = [];
  if (subjectId === 'all') {
    const allEntries = [];
    subjects.forEach(s => {
      const entries = getLeaderboard(s.id);
      entries.forEach(entry => allEntries.push({ ...entry, subjectName: s.name }));
    });
    allEntries.sort((a, b) => b.score - a.score);
    leaderboard = allEntries.slice(0, 15);
  } else {
    leaderboard = getLeaderboard(subjectId);
  }

  table.innerHTML = `
    <thead>
      <tr>
        <th>Rank</th>
        <th>Student Name</th>
        ${subjectId === 'all' ? '<th>Subject</th>' : ''}
        <th>Score</th>
        <th>Date</th>
      </tr>
    </thead>
    <tbody id="leaderboard-body"></tbody>
  `;

  const tbody = document.getElementById('leaderboard-body');
  if (leaderboard.length === 0) {
    tbody.innerHTML = `<tr><td colspan="${subjectId === 'all' ? 5 : 4}" style="text-align: center; padding: 2rem; opacity: 0.6;">No rankings yet. Start a quiz to be the first!</td></tr>`;
    return;
  }

  leaderboard.forEach((entry, index) => {
    const row = document.createElement('tr');
    if (index < 3) row.style.background = 'rgba(255,255,255,0.1)';

    const date = new Date(entry.date);
    const formattedDate = date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });

    row.innerHTML = `
      <td><span class="glass-tag" style="background: ${index === 0 ? 'var(--zambia-orange)' : 'rgba(255,255,255,0.2)'}">${index + 1}</span></td>
      <td style="font-weight: 600;">${entry.name}</td>
      ${subjectId === 'all' ? `<td>${entry.subjectName}</td>` : ''}
      <td style="color: var(--zambia-green); font-weight: bold;">${entry.score}%</td>
      <td style="opacity: 0.7; font-size: 0.85rem;">${formattedDate}</td>
    `;
    tbody.appendChild(row);
  });
}

// Reset functions attached to UI
function handleResetLeaderboard() {
  const activeTab = document.querySelector('.subject-tab.active-tab');
  const subjectId = activeTab.getAttribute('data-subject');

  if (confirm(`Are you sure you want to clear the ${subjectId === 'all' ? 'entire' : subjectId} leaderboard? This cannot be undone.`)) {
    if (subjectId === 'all') {
      resetAllLeaderboards();
    } else {
      resetLeaderboard(subjectId);
    }
    loadLeaderboard(subjectId);
  }
}