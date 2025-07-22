// Astro expression helper
function setAstroMood(mood) {
  const mouth = document.getElementById('astroMouth');
  mouth.className = 'mouth ' + mood;
}

// Notification
function showAstroNotification() {
  const bubble = document.getElementById('astroNotification');
  bubble.style.display = 'block';
  setTimeout(() => {
    bubble.style.display = 'none';
  }, 2700);
}

// To-Do timer logic
let timerInterval = null;
let seconds = 0;
let activeTaskLi = null;
let activeTaskDuration = 0; // in seconds

function updateTimerDisplay() {
  const hr = Math.floor(seconds / 3600).toString().padStart(2, '0');
  const min = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
  const sec = (seconds % 60).toString().padStart(2, '0');
  document.getElementById('timer').textContent = `${hr}:${min}:${sec}`;
}

document.getElementById('startTimer').onclick = function () {
  if (!activeTaskLi) {
    setAstroMood('surprised');
    setTimeout(() => setAstroMood('smile'), 1400);
    return;
  }
  if (!timerInterval) {
    setAstroMood('smile');
    timerInterval = setInterval(() => {
      seconds++;
      updateTimerDisplay();
      if (activeTaskDuration && seconds >= activeTaskDuration) {
        clearInterval(timerInterval);
        timerInterval = null;
        activeTaskLi.classList.remove('active');
        activeTaskLi.classList.add('completed');
        setAstroMood('surprised');
        showAstroNotification();
        setTimeout(() => setAstroMood('smile'), 1200);
        activeTaskLi = null;
        seconds = 0;
        activeTaskDuration = 0;
        updateTimerDisplay();
      } else if (seconds % 15 === 0) {
        setAstroMood('surprised');
        setTimeout(() => setAstroMood('smile'), 1000);
      }
    }, 1000);
  }
};

document.getElementById('resetTimer').onclick = function () {
  clearInterval(timerInterval);
  timerInterval = null;
  seconds = 0;
  updateTimerDisplay();
  setAstroMood('smile');
  if (activeTaskLi) activeTaskLi.classList.remove('active');
  activeTaskLi = null;
  activeTaskDuration = 0;
};

document.getElementById('taskForm').onsubmit = function (e) {
  e.preventDefault();
  const input = document.getElementById('taskInput');
  const hourInput = document.getElementById('hourInput');
  const minuteInput = document.getElementById('minuteInput');
  const secondInput = document.getElementById('secondInput');
  const val = input.value.trim();

  // Parse/validate time
  const hour = parseInt(hourInput.value) || 0;
  const minute = parseInt(minuteInput.value) || 0;
  const sec = parseInt(secondInput.value) || 0;
  const totalSeconds = hour * 3600 + minute * 60 + sec;
  if (!val || totalSeconds <= 0) return;

  const li = document.createElement('li');
  li.className = 'task-item';
  li.textContent = val + ' ';
  li.dataset.duration = totalSeconds;

  // Show a time badge, HH:MM:SS
  const timeSpan = document.createElement('span');
  const dispHr = hour.toString().padStart(2, '0');
  const dispMin = minute.toString().padStart(2, '0');
  const dispSec = sec.toString().padStart(2, '0');
  timeSpan.className = 'time-span';
  timeSpan.textContent = `${dispHr}:${dispMin}:${dispSec}`;
  li.appendChild(timeSpan);

  li.onclick = function () {
    if (activeTaskLi) activeTaskLi.classList.remove('active');
    if (activeTaskLi === li) {
      // Unselect (toggle)
      activeTaskLi = null;
      activeTaskDuration = 0;
      seconds = 0;
      updateTimerDisplay();
      setAstroMood('smile');
      return;
    }
    // Select
    activeTaskLi = li;
    li.classList.add('active');
    setAstroMood('surprised');
    setTimeout(() => setAstroMood('smile'), 900);
    seconds = 0;
    activeTaskDuration = parseInt(li.dataset.duration) || 0;
    updateTimerDisplay();
  };

  // Delete Button
  const delBtn = document.createElement('button');
  delBtn.className = 'delete-btn';
  delBtn.innerHTML = '&times;';
  delBtn.onclick = function (evt) {
    evt.stopPropagation();
    if (li === activeTaskLi) {
      clearInterval(timerInterval);
      timerInterval = null;
      activeTaskLi = null;
      activeTaskDuration = 0;
      seconds = 0;
      updateTimerDisplay();
      setAstroMood('sad');
      setTimeout(() => setAstroMood('smile'), 1200);
    }
    li.remove();
  };

  li.appendChild(delBtn);
  document.getElementById('taskList').appendChild(li);
  input.value = '';
  hourInput.value = '';
  minuteInput.value = '';
  secondInput.value = '';
  setAstroMood('smile');

  // --- AUTO-SELECT newly added task ---
  if (activeTaskLi) activeTaskLi.classList.remove('active');
  activeTaskLi = li;
  li.classList.add('active');
  activeTaskDuration = parseInt(li.dataset.duration) || 0;
  seconds = 0;
  updateTimerDisplay();
};

document.querySelector('.head').onmouseenter = () => setAstroMood('surprised');
document.querySelector('.head').onmouseleave = () => setAstroMood('smile');

window.onload = updateTimerDisplay;
