const questionScene = document.getElementById("questionScene");
const answerScene = document.getElementById("answerScene");
const yesBtn = document.getElementById("yesBtn");
const noBtn = document.getElementById("noBtn");
const heartRain = document.getElementById("heartRain");

const heartGlyphs = ["♥", "♡", "💗", "💖", "💕", "💘"];
let noMoveCount = 0;

function randomBetween(min, max) {
  return Math.random() * (max - min) + min;
}

function overlaps(a, b, padding = 22) {
  return !(
    a.right + padding < b.left ||
    a.left - padding > b.right ||
    a.bottom + padding < b.top ||
    a.top - padding > b.bottom
  );
}

function viewportBounds() {
  return {
    width: window.innerWidth,
    height: window.innerHeight,
  };
}

function moveNoButton() {
  noMoveCount += 1;
  noBtn.classList.add("is-running", "is-teasing");

  const { width, height } = viewportBounds();
  const buttonRect = noBtn.getBoundingClientRect();
  const yesRect = yesBtn.getBoundingClientRect();
  const safeInset = Math.max(14, Math.min(width, height) * 0.035);
  const maxX = Math.max(safeInset, width - buttonRect.width - safeInset);
  const maxY = Math.max(safeInset, height - buttonRect.height - safeInset);

  let nextRect;
  let nextX = safeInset;
  let nextY = safeInset;

  for (let attempt = 0; attempt < 80; attempt += 1) {
    nextX = randomBetween(safeInset, maxX);
    nextY = randomBetween(safeInset, maxY);
    nextRect = {
      left: nextX,
      top: nextY,
      right: nextX + buttonRect.width,
      bottom: nextY + buttonRect.height,
    };

    const awayFromYes = !overlaps(nextRect, yesRect, 34);
    const awayFromCenter =
      Math.abs(nextX + buttonRect.width / 2 - width / 2) > width * 0.14 ||
      Math.abs(nextY + buttonRect.height / 2 - height / 2) > height * 0.16;

    if (awayFromYes && awayFromCenter) {
      break;
    }
  }

  noBtn.style.left = `${nextX}px`;
  noBtn.style.top = `${nextY}px`;
  noBtn.style.transform = `rotate(${noMoveCount % 2 === 0 ? "-" : ""}${randomBetween(3, 8).toFixed(1)}deg)`;

  window.setTimeout(() => {
    noBtn.classList.remove("is-teasing");
  }, 300);
}

function startHeartRain() {
  heartRain.replaceChildren();

  for (let i = 0; i < 72; i += 1) {
    const drop = document.createElement("span");
    drop.className = "heart-drop";
    drop.textContent = heartGlyphs[i % heartGlyphs.length];
    drop.style.setProperty("--left", `${randomBetween(-4, 101).toFixed(2)}vw`);
    drop.style.setProperty("--size", `${randomBetween(18, 42).toFixed(1)}px`);
    drop.style.setProperty("--duration", `${randomBetween(3.8, 8.5).toFixed(2)}s`);
    drop.style.setProperty("--delay", `${randomBetween(-8, 0).toFixed(2)}s`);
    drop.style.setProperty("--drift", `${randomBetween(-64, 64).toFixed(1)}px`);
    drop.style.setProperty("--rotate", `${randomBetween(-35, 35).toFixed(1)}deg`);
    drop.style.setProperty("--opacity", randomBetween(0.48, 0.95).toFixed(2));
    heartRain.appendChild(drop);
  }
}

function showAnswer() {
  questionScene.classList.remove("is-active");
  answerScene.classList.add("is-active");
  startHeartRain();
}

yesBtn.addEventListener("click", showAnswer);

["pointerenter", "pointerdown", "touchstart", "click"].forEach((eventName) => {
  noBtn.addEventListener(
    eventName,
    (event) => {
      event.preventDefault();
      moveNoButton();
    },
    { passive: false },
  );
});

window.addEventListener("resize", () => {
  if (noBtn.classList.contains("is-running")) {
    moveNoButton();
  }
});
