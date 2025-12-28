// Admin/Teacher functionality for ZamQuiz Champion

document.addEventListener('DOMContentLoaded', function () {
  // Check if already logged in this session
  if (sessionStorage.getItem('teacherLoggedIn') === 'true') {
    document.getElementById('teacher-login-overlay').style.display = 'none';
  }

  // Login events
  const loginBtn = document.getElementById('login-btn');
  const passwordInput = document.getElementById('teacher-password');
  if (loginBtn) {
    loginBtn.addEventListener('click', handleLogin);
    passwordInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') handleLogin();
    });
  }

  // Logout event
  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      sessionStorage.removeItem('teacherLoggedIn');
      window.location.reload();
    });
  }

  // Subject management events
  const addSubjectBtn = document.getElementById('add-subject-btn');
  if (addSubjectBtn) {
    addSubjectBtn.addEventListener('click', handleAddSubject);
  }

  // Question form events
  const questionForm = document.getElementById('question-form');
  if (questionForm) {
    questionForm.addEventListener('submit', handleQuestionSubmit);
  }

  const questionTypeSelect = document.getElementById('question-type');
  if (questionTypeSelect) {
    questionTypeSelect.addEventListener('change', updateFormFields);
  }

  // Initial renders
  renderAdminSubjects();
  renderQuestionSubjects();
  updateFormFields();
});

// Handle teacher login
function handleLogin() {
  const passwordInput = document.getElementById('teacher-password');
  const errorMsg = document.getElementById('login-error');

  if (passwordInput.value === '12345678') {
    sessionStorage.setItem('teacherLoggedIn', 'true');
    document.getElementById('teacher-login-overlay').style.display = 'none';
  } else {
    errorMsg.style.display = 'block';
    passwordInput.value = '';
    passwordInput.focus();
  }
}

// Render subjects in the admin sidebar
function renderAdminSubjects() {
  const container = document.getElementById('subjects-list-admin');
  if (!container) return;

  const subjects = getAvailableSubjects();
  container.innerHTML = '';

  subjects.forEach(subject => {
    const div = document.createElement('div');
    div.style.display = 'flex';
    div.style.justifyContent = 'space-between';
    div.style.alignItems = 'center';
    div.style.padding = '0.5rem';
    div.style.background = 'rgba(255,255,255,0.3)';
    div.style.borderRadius = '8px';
    div.style.marginBottom = '0.5rem';

    div.innerHTML = `
      <span>${subject.name}</span>
      <button onclick="handleRemoveSubject('${subject.id}')" style="background: none; border: none; color: var(--zambia-red); cursor: pointer; font-size: 1.2rem;">&times;</button>
    `;
    container.appendChild(div);
  });
}

// Render subjects in the question form dropdown
function renderQuestionSubjects() {
  const select = document.getElementById('subject');
  if (!select) return;

  const subjects = getAvailableSubjects();
  select.innerHTML = '';

  subjects.forEach(subject => {
    const option = document.createElement('option');
    option.value = subject.id;
    option.textContent = subject.name;
    select.appendChild(option);
  });
}

// Handle adding a new subject
function handleAddSubject() {
  const nameInput = document.getElementById('new-subject-name');
  const descInput = document.getElementById('new-subject-desc');

  const name = nameInput.value.trim();
  const desc = descInput.value.trim();

  if (!name) {
    alert("Please enter a subject name.");
    return;
  }

  const id = name.toLowerCase().replace(/\s+/g, '-');

  if (addSubject(id, name, desc)) {
    nameInput.value = '';
    descInput.value = '';
    renderAdminSubjects();
    renderQuestionSubjects();
    alert(`Subject "${name}" added!`);
  } else {
    alert("Subject already exists.");
  }
}

// Handle removing a subject
function handleRemoveSubject(id) {
  if (confirm("Are you sure you want to remove this subject? All questions for this subject will be hidden.")) {
    removeSubject(id);
    renderAdminSubjects();
    renderQuestionSubjects();
  }
}

// Update form fields based on question type
function updateFormFields() {
  const questionType = document.getElementById('question-type').value;
  const optionsContainer = document.getElementById('options-container');
  const booleanOptions = document.getElementById('boolean-options');
  const customOptions = document.getElementById('custom-options');
  const correctChoiceContainer = document.getElementById('correct-choice-container');
  const correctAnswerContainer = document.getElementById('correct-answer-container');
  const optionsLabel = document.getElementById('options-label');

  // Reset
  optionsContainer.style.display = 'none';
  booleanOptions.style.display = 'none';
  customOptions.style.display = 'none';
  correctChoiceContainer.style.display = 'none';
  correctAnswerContainer.style.display = 'none';

  if (questionType === 'multiple') {
    optionsContainer.style.display = 'block';
    customOptions.style.display = 'block';
    correctChoiceContainer.style.display = 'block';
    optionsLabel.textContent = 'Options (one per line):';
  } else if (questionType === 'boolean') {
    optionsContainer.style.display = 'block';
    booleanOptions.style.display = 'block';
    optionsLabel.textContent = 'Select the correct answer:';
  } else if (questionType === 'fill') {
    correctAnswerContainer.style.display = 'block';
  }
}

// Handle question form submission
function handleQuestionSubmit(event) {
  event.preventDefault();

  const subject = document.getElementById('subject').value;
  const questionText = document.getElementById('question-text').value;
  const questionType = document.getElementById('question-type').value;

  let newQuestion = {
    id: Date.now(),
    question: questionText,
    type: questionType
  };

  if (questionType === 'multiple') {
    const optionsText = document.getElementById('custom-options').value;
    newQuestion.options = optionsText.split('\n').map(o => o.trim()).filter(o => o !== '');
    newQuestion.answer = document.getElementById('correct-option').value.trim();

    if (newQuestion.options.length < 2 || !newQuestion.answer) {
      alert("Please provide at least 2 options and a correct answer.");
      return;
    }
  } else if (questionType === 'boolean') {
    const selected = document.querySelector('input[name="boolean-answer"]:checked');
    if (!selected) {
      alert("Please select True or False.");
      return;
    }
    newQuestion.options = ['True', 'False'];
    newQuestion.answer = selected.value;
  } else if (questionType === 'fill') {
    newQuestion.answer = document.getElementById('correct-answer').value.trim();
    if (!newQuestion.answer) {
      alert("Please provide a correct answer.");
      return;
    }
  }

  // Save question to localStorage
  saveQuestion(subject, newQuestion);

  // Success feedback
  document.getElementById('question-form').reset();
  updateFormFields();
  const successMsg = document.getElementById('success-message');
  successMsg.style.display = 'block';
  setTimeout(() => successMsg.style.display = 'none', 3000);

  // Update preview
  addQuestionToPreview(newQuestion, subject);
}

// Save question to localStorage
function saveQuestion(subjectId, question) {
  const key = `questions_${subjectId}`;
  let questions = JSON.parse(localStorage.getItem(key) || '[]');
  questions.push(question);
  localStorage.setItem(key, JSON.stringify(questions));
}

// Add question to preview (Recent Questions)
function addQuestionToPreview(question, subjectId) {
  const previewContainer = document.getElementById('questions-preview');
  const subjects = getAvailableSubjects();
  const subjectName = subjects.find(s => s.id === subjectId)?.name || subjectId;

  const div = document.createElement('div');
  div.className = 'glass-card slide-in';
  div.style.marginBottom = '1rem';
  div.style.padding = '1rem';

  let details = '';
  if (question.type === 'multiple') {
    details = `<p style="font-size: 0.9rem; margin: 0.5rem 0;">Options: ${question.options.join(', ')}</p>`;
  }

  div.innerHTML = `
    <div style="display: flex; justify-content: space-between; align-items: flex-start;">
      <div>
        <span style="font-size: 0.7rem; text-transform: uppercase; font-weight: 600; opacity: 0.6;">${subjectName} | ${question.type}</span>
        <h4 style="margin: 0.2rem 0;">${question.question}</h4>
        ${details}
        <p style="font-size: 0.9rem; color: var(--zambia-green); font-weight: 600;">Answer: ${question.answer}</p>
      </div>
    </div>
  `;

  if (previewContainer.firstChild) {
    previewContainer.insertBefore(div, previewContainer.firstChild);
  } else {
    previewContainer.appendChild(div);
  }
}

// Export Data (Backup)
function handleExportData() {
  const data = {};
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    data[key] = localStorage.getItem(key);
  }

  const jsonStr = JSON.stringify(data, null, 2);
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

// Import Data (Restore)
function handleImportData(input) {
  const file = input.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function (e) {
    try {
      const data = JSON.parse(e.target.result);

      if (confirm('WARNING: This will overwrite all current data with the backup. Are you sure?')) {
        // Clear current storage
        localStorage.clear();

        // Restore from backup
        for (const key in data) {
          localStorage.setItem(key, data[key]);
        }

        alert('Data restored successfully! The page will now reload.');
        location.reload();
      }
    } catch (err) {
      alert('Error reading backup file. Please ensure it is a valid JSON file.');
      console.error(err);
    }
  };
  reader.readAsText(file);
  input.value = ''; // Reset input
}