// Quiz logic for ZamQuiz Champion

// Global variables
let currentQuestions = [];
let currentQuestionIndex = 0;
let score = 0;
let timerInterval;
let timeLeft;
let quizSubject = '';
let isInTwoPlayerMode = false;
let currentPlayer = 1;
let player1Score = 0;
let player2Score = 0;

// Initialize quiz
function initializeQuiz(subject, questionsCount = 10, timeLimit = 300) {
  // Get quiz elements
  const quizContainer = document.getElementById('quiz-container');
  const timerElement = document.getElementById('timer');

  if (!quizContainer || !timerElement) {
    console.error('Quiz elements not found');
    return;
  }

  // Set quiz subject
  quizSubject = subject;

  // Check if this is Quiz of the Day
  const isQuizOfDay = sessionStorage.getItem('quizOfDay') === 'true';
  const subjects = getAvailableSubjects();
  const subjectName = subjects.find(s => s.id === subject)?.name || subject;

  if (isQuizOfDay) {
    document.getElementById('quiz-title').textContent = 'Quiz of the Day: ' + subjectName;
    sessionStorage.removeItem('quizOfDay');
  } else {
    document.getElementById('quiz-title').textContent = subjectName + ' Quiz';
  }

  // Check if in two-player mode
  isInTwoPlayerMode = getQueryParam('twoPlayer') === 'true';
  if (isInTwoPlayerMode) {
    currentPlayer = getQueryParam('player') ? parseInt(getQueryParam('player')) : 1;
    document.getElementById('quiz-title').textContent = 'Player ' + currentPlayer + ': ' + subjectName + ' Quiz';
  }

  // Get random questions
  currentQuestions = getRandomQuestions(subject, questionsCount);
  currentQuestionIndex = 0;
  score = 0;

  if (currentQuestions.length === 0) {
    document.getElementById('question-container').innerHTML = '<p>No questions available for this subject yet. Ask your teacher to add some!</p>';
    return;
  }

  // Start timer
  timeLeft = timeLimit;
  updateTimer(timerElement);

  timerInterval = setInterval(() => {
    timeLeft--;
    updateTimer(timerElement);

    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      endQuiz();
    }
  }, 1000);

  // Show first question
  showQuestion();
}

// Update timer display
function updateTimer(timerElement) {
  timerElement.textContent = 'Time left: ' + formatTime(timeLeft);

  // Change color as time runs low
  if (timeLeft <= 60) {
    timerElement.style.color = 'var(--zambia-red)';
    timerElement.style.fontWeight = 'bold';
  } else if (timeLeft <= 120) {
    timerElement.style.color = 'var(--zambia-orange)';
  } else {
    timerElement.style.color = 'inherit';
  }
}

// Show current question
function showQuestion() {
  const questionContainer = document.getElementById('question-container');
  if (!questionContainer) return;

  const currentQuestion = currentQuestions[currentQuestionIndex];
  const questionNumber = currentQuestionIndex + 1;
  const totalQuestions = currentQuestions.length;

  questionContainer.innerHTML = '';

  const questionElement = document.createElement('div');
  questionElement.className = 'glass-card slide-in';
  questionElement.style.marginTop = '2rem';

  const questionText = document.createElement('div');
  questionText.style.fontSize = '1.25rem';
  questionText.style.fontWeight = '600';
  questionText.style.marginBottom = '1.5rem';
  questionText.textContent = `Question ${questionNumber}/${totalQuestions}: ${currentQuestion.question}`;
  questionElement.appendChild(questionText);

  if (currentQuestion.type === 'multiple' || currentQuestion.type === 'boolean') {
    const optionsContainer = document.createElement('div');
    optionsContainer.style.display = 'grid';
    optionsContainer.style.gap = '10px';

    currentQuestion.options.forEach((option) => {
      const optionButton = document.createElement('button');
      optionButton.className = 'btn';
      optionButton.style.background = 'white';
      optionButton.style.border = '1px solid var(--glass-border)';
      optionButton.style.textAlign = 'left';
      optionButton.textContent = option;
      optionButton.addEventListener('click', () => selectOption(option));
      optionsContainer.appendChild(optionButton);
    });

    questionElement.appendChild(optionsContainer);
  } else if (currentQuestion.type === 'fill') {
    const answerInput = document.createElement('input');
    answerInput.type = 'text';
    answerInput.className = 'form-control';
    answerInput.placeholder = 'Type your answer here...';
    answerInput.id = 'fill-answer';
    questionElement.appendChild(answerInput);

    const submitButton = document.createElement('button');
    submitButton.className = 'btn btn-green w-full';
    submitButton.textContent = 'Submit Answer';
    submitButton.addEventListener('click', () => {
      const answer = document.getElementById('fill-answer').value.trim();
      selectOption(answer);
    });
    questionElement.appendChild(submitButton);
  }

  // Progress Bar
  const progressContainer = document.createElement('div');
  progressContainer.style.background = 'rgba(0,0,0,0.1)';
  progressContainer.style.height = '10px';
  progressContainer.style.borderRadius = '5px';
  progressContainer.style.marginTop = '2rem';
  progressContainer.style.overflow = 'hidden';

  const progressBar = document.createElement('div');
  progressBar.style.background = 'var(--zambia-green)';
  progressBar.style.height = '100%';
  progressBar.style.width = `${(questionNumber / totalQuestions) * 100}%`;
  progressBar.style.transition = 'width 0.3s ease';

  progressContainer.appendChild(progressBar);
  questionElement.appendChild(progressContainer);

  questionContainer.appendChild(questionElement);
}

// Handle option selection
function selectOption(selectedOption) {
  const currentQuestion = currentQuestions[currentQuestionIndex];
  let isCorrect = false;

  if (currentQuestion.type === 'multiple' || currentQuestion.type === 'boolean') {
    isCorrect = selectedOption === currentQuestion.answer;
  } else if (currentQuestion.type === 'fill') {
    isCorrect = selectedOption.toLowerCase() === currentQuestion.answer.toLowerCase();
  }

  if (isCorrect) {
    score++;
    playSound('correct');
  } else {
    playSound('incorrect');
  }

  highlightAnswer(selectedOption, isCorrect, currentQuestion);

  setTimeout(() => {
    currentQuestionIndex++;
    if (currentQuestionIndex < currentQuestions.length) {
      showQuestion();
    } else {
      endQuiz();
    }
  }, 1500);
}

// Highlight the selected answer
function highlightAnswer(selectedOption, isCorrect, question) {
  const buttons = document.querySelectorAll('.btn');
  buttons.forEach(btn => {
    btn.disabled = true;
    if (btn.textContent === selectedOption) {
      btn.style.background = isCorrect ? 'var(--zambia-green)' : 'var(--zambia-red)';
      btn.style.color = 'white';
    }
    if (!isCorrect && btn.textContent === question.answer) {
      btn.style.border = '2px solid var(--zambia-green)';
    }
  });

  const fillAnswer = document.getElementById('fill-answer');
  if (fillAnswer) {
    fillAnswer.disabled = true;
    fillAnswer.style.borderColor = isCorrect ? 'var(--zambia-green)' : 'var(--zambia-red)';

    const correctMsg = document.createElement('p');
    correctMsg.style.marginTop = '10px';
    correctMsg.style.color = 'var(--zambia-green)';
    correctMsg.innerHTML = `Correct answer: <strong>${question.answer}</strong>`;
    fillAnswer.parentNode.appendChild(correctMsg);
  }
}

// End the quiz
function endQuiz() {
  clearInterval(timerInterval);
  const totalQuestions = currentQuestions.length;
  const percentage = Math.round((score / totalQuestions) * 100);
  const quizContainer = document.getElementById('quiz-container');
  const questionContainer = document.getElementById('question-container');

  const userData = getUserData();
  const playerName = userData?.name || 'Guest';

  const resultsElement = document.createElement('div');
  resultsElement.className = 'glass-card fade-in';
  resultsElement.style.textAlign = 'center';
  resultsElement.style.marginTop = '2rem';

  if (isInTwoPlayerMode) {
    // Two-player logic...
    if (currentPlayer === 1) {
      sessionStorage.setItem('player1Score', score);
      sessionStorage.setItem('player1Name', playerName);
      resultsElement.innerHTML = `
        <h2>Player 1 Results: ${playerName}</h2>
        <div style="font-size: 3rem; font-weight: 600; margin: 2rem 0;">${score}/${totalQuestions}</div>
        <p>Now it's Player 2's turn!</p>
        <button id="continue-button" class="btn btn-green w-full">Continue to Player 2</button>
      `;
      quizContainer.replaceChild(resultsElement, questionContainer);
      document.getElementById('continue-button').addEventListener('click', () => {
        window.location.href = `quiz.html?subject=${quizSubject}&twoPlayer=true&player=2`;
      });
    } else {
      const p1Score = parseInt(sessionStorage.getItem('player1Score') || '0');
      const p1Name = sessionStorage.getItem('player1Name') || 'Player 1';
      const result = saveTwoPlayerScores(quizSubject, p1Name, playerName, p1Score, score, totalQuestions);

      sessionStorage.removeItem('player1Score');
      sessionStorage.removeItem('player1Name');

      resultsElement.innerHTML = `
        <h2>Two-Player Results</h2>
        <div class="grid" style="grid-template-columns: 1fr 1fr; margin: 2rem 0;">
          <div class="glass-card">
            <h4>${p1Name}</h4>
            <div style="font-size: 2rem;">${p1Score}/${totalQuestions}</div>
          </div>
          <div class="glass-card">
            <h4>${playerName}</h4>
            <div style="font-size: 2rem;">${score}/${totalQuestions}</div>
          </div>
        </div>
        <div class="glass-card" style="background: var(--zambia-green); color: white;">
          <h3>${result.winner === 'Tie' ? "It's a Tie!" : result.winner + " Wins!"}</h3>
        </div>
        <div style="margin-top: 2rem; display: flex; gap: 10px; justify-content: center;">
          <a href="two-player.html" class="btn btn-primary">Try Again</a>
          <a href="../index.html" class="btn">Home</a>
        </div>
      `;
      quizContainer.replaceChild(resultsElement, questionContainer);
    }
  } else {
    // Single player save
    saveQuizResult(quizSubject, score, totalQuestions, playerName);

    let feedback = percentage >= 80 ? 'Excellent! Quiz Champion!' :
      percentage >= 60 ? 'Good job! Getting there!' :
        percentage >= 40 ? 'Keep practicing!' : 'Need more study!';

    resultsElement.innerHTML = `
      <h2>Quiz Results: ${playerName}</h2>
      <div style="font-size: 4rem; font-weight: 600; margin: 1.5rem 0;">${percentage}%</div>
      <p style="font-size: 1.2rem; margin-bottom: 2rem;">${feedback} (${score}/${totalQuestions})</p>
      <div style="display: flex; gap: 10px; justify-content: center;">
        <button id="restart-button" class="btn btn-green">Try Again</button>
        <a href="../index.html" class="btn btn-primary">Home</a>
      </div>
    `;
    quizContainer.replaceChild(resultsElement, questionContainer);
    document.getElementById('restart-button').addEventListener('click', () => location.reload());
  }
}

// Basic playSound implementation
function playSound(type) {
  try {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    oscillator.frequency.value = type === 'correct' ? 800 : 300;
    oscillator.type = 'sine';
    gainNode.gain.value = 0.05;
    oscillator.start();
    setTimeout(() => oscillator.stop(), type === 'correct' ? 200 : 300);
  } catch (e) { }
}