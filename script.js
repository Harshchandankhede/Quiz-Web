const questions = {
  easy: [
    { q: '2 + 2 = ?', a: ['3', '4', '5'], correct: 1 },
    { q: 'Color of sky?', a: ['Blue', 'Green', 'Red'], correct: 0 },
    { q: 'How many days are there in a week?', a: ['7', '5', '9'], correct: 0 }
  ],
  medium: [
    { q: 'Capital of India?', a: ['Mumbai', 'Delhi', 'Pune'], correct: 1 },
    { q: '5 * 6 = ?', a: ['30', '25', '20'], correct: 0 },
    { q: 'Which planet is known as the Red Planet?', a: ['Mars', 'Venus', 'Jupiter'], correct: 0 }
  ],
  hard: [
    { q: 'JS stands for?', a: ['JavaScript', 'Java', 'JustScript'], correct: 0 },
    { q: 'HTML is?', a: ['Language', 'Framework', 'Library'], correct: 0 },
    { q: 'Which method converts JSON string to object?', a: ['JSON.parse()', 'JSON.stringify()', 'JSON.convert()'], correct: 0 }
  ]
};

let currentQuestions = [];
let index = 0;
let score = 0;
let timer;
let timeLeft = 10;
let answered = false;
let currentLevel = 'easy';

const startScreen = document.getElementById('start-screen');
const quizScreen = document.getElementById('quiz-screen');
const resultScreen = document.getElementById('result-screen');
const questionEl = document.getElementById('question');
const answersDiv = document.getElementById('answers');
const timeEl = document.getElementById('time');
const scoreEl = document.getElementById('score');
const finalScoreEl = document.getElementById('final-score');
const progressBar = document.getElementById('progressBar');
const progressText = document.getElementById('progressText');
const feedbackEl = document.getElementById('feedback');
const leaderboardEl = document.getElementById('leaderboard');
const emptyBoardEl = document.getElementById('emptyBoard');
const questionLevelEl = document.getElementById('questionLevel');
const themeToggle = document.getElementById('themeToggle');
const themeIcon = document.getElementById('themeIcon');

function shuffle(array) {
  return [...array].sort(() => Math.random() - 0.5);
}

function startQuiz() {
  currentLevel = document.getElementById('difficulty').value;
  currentQuestions = shuffle(questions[currentLevel]);
  index = 0;
  score = 0;
  scoreEl.textContent = score;
  feedbackEl.textContent = '';

  startScreen.classList.add('hidden');
  resultScreen.classList.add('hidden');
  quizScreen.classList.remove('hidden');

  loadQuestion();
}

function loadQuestion() {
  clearInterval(timer);

  if (index >= currentQuestions.length) {
    endQuiz();
    return;
  }

  answered = false;
  const current = currentQuestions[index];
  questionEl.textContent = current.q;
  questionLevelEl.textContent = `${capitalize(currentLevel)} Challenge`;
  progressText.textContent = `${index + 1} / ${currentQuestions.length}`;
  progressBar.style.width = `${((index) / currentQuestions.length) * 100}%`;
  feedbackEl.textContent = '';
  answersDiv.innerHTML = '';

  current.a.forEach((ans, i) => {
    const btn = document.createElement('button');
    btn.className = 'answer-btn';
    btn.textContent = ans;
    btn.onclick = () => checkAnswer(i, btn);
    answersDiv.appendChild(btn);
  });

  startTimer();
}

function checkAnswer(selectedIndex, selectedButton) {
  if (answered) return;
  answered = true;
  clearInterval(timer);

  const correctIndex = currentQuestions[index].correct;
  const buttons = [...document.querySelectorAll('.answer-btn')];

  buttons.forEach((button, i) => {
    button.classList.add('disabled');
    if (i === correctIndex) button.classList.add('correct');
  });

  if (selectedIndex === correctIndex) {
    score++;
    scoreEl.textContent = score;
    feedbackEl.textContent = '✅ Correct answer!';
    feedbackEl.style.color = 'var(--success)';
  } else {
    selectedButton.classList.add('wrong');
    feedbackEl.textContent = '❌ Wrong answer!';
    feedbackEl.style.color = 'var(--danger)';
  }

  setTimeout(() => {
    index++;
    loadQuestion();
  }, 900);
}

function startTimer() {
  timeLeft = 10;
  timeEl.textContent = timeLeft;

  timer = setInterval(() => {
    timeLeft--;
    timeEl.textContent = timeLeft;

    if (timeLeft <= 0) {
      clearInterval(timer);
      feedbackEl.textContent = '⏱️ Time up! Moving to next question.';
      feedbackEl.style.color = 'var(--accent)';
      setTimeout(() => {
        index++;
        loadQuestion();
      }, 700);
    }
  }, 1000);
}

function endQuiz() {
  clearInterval(timer);
  progressBar.style.width = '100%';
  quizScreen.classList.add('hidden');
  resultScreen.classList.remove('hidden');
  finalScoreEl.textContent = `${score} / ${currentQuestions.length}`;
  showLeaderboard();
}

function saveScore() {
  const name = document.getElementById('username').value.trim() || 'Anonymous';
  const leaderboard = JSON.parse(localStorage.getItem('scores')) || [];

  leaderboard.push({
    name,
    score,
    level: currentLevel,
    date: new Date().toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short'
    })
  });

  leaderboard.sort((a, b) => b.score - a.score);
  localStorage.setItem('scores', JSON.stringify(leaderboard.slice(0, 20)));
  showLeaderboard();
  document.getElementById('username').value = '';
}

function showLeaderboard() {
  const leaderboard = JSON.parse(localStorage.getItem('scores')) || [];
  leaderboardEl.innerHTML = '';

  emptyBoardEl.style.display = leaderboard.length ? 'none' : 'block';

  leaderboard.slice(0, 5).forEach((entry, idx) => {
    const li = document.createElement('li');
    li.className = 'leaderboard-item';
    li.innerHTML = `
      <div class="player">
        <span class="rank-badge">${idx + 1}</span>
        <div>
          <strong>${entry.name}</strong>
          <div class="metric-label">${capitalize(entry.level)} • ${entry.date}</div>
        </div>
      </div>
      <strong>${entry.score}</strong>
    `;
    leaderboardEl.appendChild(li);
  });
}

function restartQuiz() {
  index = 0;
  score = 0;
  timeLeft = 10;
  feedbackEl.textContent = '';
  quizScreen.classList.add('hidden');
  resultScreen.classList.add('hidden');
  startScreen.classList.remove('hidden');
}

function capitalize(value) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

themeToggle.addEventListener('click', () => {
  document.body.classList.toggle('light');
  themeIcon.textContent = document.body.classList.contains('light') ? '☀️' : '🌙';
});

showLeaderboard();