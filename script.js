document.addEventListener("DOMContentLoaded", () => {
  /* === MATRIX BACKGROUND === */
  const canvas = document.getElementById("matrix");
  const ctx = canvas.getContext("2d");
  canvas.height = window.innerHeight;
  canvas.width = window.innerWidth;
  const letters = "01<>$#@";
  const fontSize = 14;
  const columns = canvas.width / fontSize;
  const drops = Array(Math.floor(columns)).fill(1);

  function drawMatrix() {
    ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = getComputedStyle(document.body).getPropertyValue("--accent");
    ctx.font = fontSize + "px monospace";
    drops.forEach((y, i) => {
      const text = letters.charAt(Math.floor(Math.random() * letters.length));
      ctx.fillText(text, i * fontSize, y * fontSize);
      if (y * fontSize > canvas.height && Math.random() > 0.975) drops[i] = 0;
      drops[i]++;
    });
  }
  setInterval(drawMatrix, 40);

  /* === BOOT SCREEN === */
  const bootLines = [
    "[BOOT SEQUENCE INITIATED]",
    "Loading system modules...",
    "Connecting to Neural Database...",
    "Decrypting quiz data packets...",
    "Establishing secure link...",
    "Initializing user interface...",
    "System Ready.",
    "Press START to begin the test."
  ];

  const bootScreen = document.getElementById("boot-screen");
  const bootText = document.getElementById("boot-text");
  const startBtn = document.getElementById("start-btn");
  const quizCard = document.getElementById("quiz-card");

  let lineIndex = 0;

  function typeBootLine() {
    if (lineIndex < bootLines.length) {
      const line = document.createElement("div");
      line.textContent = bootLines[lineIndex];
      bootText.appendChild(line);
      lineIndex++;
      setTimeout(typeBootLine, 600);
    } else {
      startBtn.classList.remove("hidden");
    }
  }

  typeBootLine();

  startBtn.addEventListener("click", () => {
    bootScreen.classList.add("hidden");
    quizCard.classList.remove("hidden");
  });

  /* === QUIZ LOGIC === */
  const questions = [
    {
      question: "Which programming language powers the web?",
      options: ["Python", "Rust", "JavaScript", "Go"],
      answer: 2,
    },
    {
      question: "Tailwind CSS is primarily used for?",
      options: ["Data Science", "UI Styling", "Backend APIs", "Networking"],
      answer: 1,
    },
    {
      question: "HTML stands for?",
      options: [
        "HyperText Markup Language",
        "HyperTool Multi Language",
        "Hyperlink Machine Logic",
        "Hybrid Text Markdown Language",
      ],
      answer: 0,
    },
    {
      question: "Which year was JavaScript invented?",
      options: ["1992", "1995", "2000", "1998"],
      answer: 1,
    },
  ];

  const questionEl = document.getElementById("question");
  const optionsEl = document.getElementById("options");
  const nextBtn = document.getElementById("next-btn");
  const resultEl = document.getElementById("result");
  const scoreEl = document.getElementById("score");
  const resultTitle = document.getElementById("result-title");
  const progressEl = document.getElementById("progress");
  const restartBtn = document.getElementById("restart-btn");
  const quizContainer = document.getElementById("quiz-container");
  const themeSelect = document.getElementById("theme-select");

  let currentQuestion = 0;
  let score = 0;
  let answered = false;


  /* === LOAD QUESTION === */
  function loadQuestion() {
    answered = false;
    const q = questions[currentQuestion];
    questionEl.classList.remove("typewriter");
    void questionEl.offsetWidth;
    questionEl.classList.add("typewriter");
    questionEl.textContent = q.question;
    optionsEl.innerHTML = "";

    q.options.forEach((opt, index) => {
      const btn = document.createElement("button");
      btn.className =
        "w-full bg-black/40 border border-white/20 px-4 py-3 rounded-lg hover:bg-white/10 transition-all duration-300 text-left";
      btn.textContent = opt;
      btn.addEventListener("click", () => selectAnswer(index, btn));
      optionsEl.appendChild(btn);
    });

    updateProgress();
  }

  function selectAnswer(selectedIndex, button) {
    if (answered) return;
    answered = true;
    const correctIndex = questions[currentQuestion].answer;
    const allButtons = optionsEl.querySelectorAll("button");

    allButtons.forEach((btn, i) => {
      if (i === correctIndex)
        btn.classList.add("bg-green-600/70", "border-green-400");
      else if (i === selectedIndex)
        btn.classList.add("bg-red-600/70", "border-red-400");
      btn.disabled = true;
    });

    if (selectedIndex === correctIndex) score++;
  }

  function updateProgress() {
    const progress = ((currentQuestion + 1) / questions.length) * 100;
    progressEl.style.width = `${progress}%`;
  }

  nextBtn.addEventListener("click", () => {
    if (!answered) return;
    currentQuestion++;
    if (currentQuestion < questions.length) loadQuestion();
    else showResult();
  });

  function showResult() {
    quizContainer.classList.add("hidden");
    nextBtn.classList.add("hidden");
    resultEl.classList.remove("hidden");
    resultEl.classList.add("glitch");

    const passed = score >= Math.ceil(questions.length * 0.6);
    resultTitle.textContent = passed ? "ACCESS GRANTED" : "ACCESS DENIED";
    resultTitle.classList.add(passed ? "text-green-400" : "text-red-500");
    scoreEl.textContent = `Your Score: ${score} / ${questions.length}`;
  }

  restartBtn.addEventListener("click", () => {
    currentQuestion = 0;
    score = 0;
    resultEl.classList.add("hidden");
    nextBtn.classList.remove("hidden");
    quizContainer.classList.remove("hidden");
    loadQuestion();
  });

  /* === INIT === */
  loadQuestion();
});
