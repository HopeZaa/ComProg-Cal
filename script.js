const $ = (id) => document.getElementById(id);

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);
const fmt = (value, digits = 2) => {
  const rounded = Number(value.toFixed(digits));
  return rounded.toLocaleString("en-US", { maximumFractionDigits: digits });
};

function readNumber(id, min, max) {
  const input = $(id);
  const value = Number(input.value);

  input.setCustomValidity("");

  if (!Number.isFinite(value) || value < min || value > max) {
    input.setCustomValidity(`Enter a value between ${min} and ${max}.`);
    input.reportValidity();
    return null;
  }

  return value;
}

// Tabs
document.querySelectorAll(".tab").forEach((button) => {
  button.addEventListener("click", () => {
    const target = button.dataset.tab;

    document.querySelectorAll(".tab").forEach((tab) => {
      const active = tab === button;
      tab.classList.toggle("active", active);
      tab.setAttribute("aria-selected", active);
    });

    document.querySelectorAll(".panel").forEach((panel) => {
      panel.classList.toggle("active-panel", panel.id === target);
    });
  });
});

// Feature 01 — Final target
$("calculateTarget").addEventListener("click", () => {
  const quiz = readNumber("targetQuiz", 0, 10);
  const midtermRaw = readNumber("targetMidterm", 0, 400);
  if (quiz === null || midtermRaw === null) return;

  const target = Number($("targetGrade").value);

  const midtermWeighted = (midtermRaw / 400) * 35;
  const currentTotal = quiz + midtermWeighted;
  const missingWeighted = Math.max(0, target - currentTotal);

  // Final is worth 55 points, with raw score out of 400.
  const finalRawNeeded = (missingWeighted / 55) * 400;

  const result = $("targetResult");
  result.className = "result";

  let title;
  let main;
  let detail;

  if (currentTotal >= target) {
    title = "Target already reached";
    main = `<strong>0 / 400</strong><span>You already have ${fmt(currentTotal)} / 100</span>`;
    detail = `Your Midterm contributes <span class="result-highlight">${fmt(midtermWeighted)} / 35</span>. You need no minimum Final score to reach <span class="result-highlight">${target === 80 ? "S*" : "S"}</span>.`;
    result.classList.add("s");
  } else if (finalRawNeeded <= 400) {
    const gradeName = target === 80 ? "S*" : "S";
    title = `Final needed for ${gradeName}`;
    main = `<strong>${fmt(finalRawNeeded)} / 400</strong><span>≈ ${fmt(missingWeighted)} / 55</span>`;
    detail = `Current total: <span class="result-highlight">${fmt(currentTotal)} / 100</span> · Missing: <span class="result-highlight">${fmt(missingWeighted)} points</span> · Final contribution needed: <span class="result-highlight">${fmt(missingWeighted)} / 55</span>.`;
  } else {
    title = "Target is not reachable";
    main = `<strong>&gt; 400 / 400</strong><span>Final maximum is 400</span>`;
    detail = `Even with 400 / 400 in Final, your total would be <span class="result-highlight">${fmt(currentTotal + 55)} / 100</span>, which is below ${target}.`;
    result.classList.add("u");
  }

  result.innerHTML = `
    <div class="result-title">${title}</div>
    <div class="result-main">${main}</div>
    <p class="result-detail">${detail}</p>
  `;
  result.classList.remove("hidden");
});

// Feature 02 — Grade calculator
let gradeMode = "weighted";

document.querySelectorAll(".mode").forEach((button) => {
  button.addEventListener("click", () => {
    gradeMode = button.dataset.mode;

    document.querySelectorAll(".mode").forEach((mode) => {
      mode.classList.toggle("active", mode === button);
    });

    const raw = gradeMode === "raw";

    $("midLabel").innerHTML = `Midterm <small>out of ${raw ? "400" : "35"}</small>`;
    $("finalLabel").innerHTML = `Final <small>out of ${raw ? "400" : "55"}</small>`;

    $("gradeMidterm").max = raw ? 400 : 35;
    $("gradeFinal").max = raw ? 400 : 55;
    $("gradeMidterm").placeholder = raw ? "e.g. 280" : "e.g. 25";
    $("gradeFinal").placeholder = raw ? "e.g. 320" : "e.g. 45";
    $("gradeMidterm").value = "";
    $("gradeFinal").value = "";
    $("gradeResult").classList.add("hidden");
  });
});

$("calculateGrade").addEventListener("click", () => {
  const quiz = readNumber("gradeQuiz", 0, 10);
  const midMax = gradeMode === "raw" ? 400 : 35;
  const finalMax = gradeMode === "raw" ? 400 : 55;
  const mid = readNumber("gradeMidterm", 0, midMax);
  const final = readNumber("gradeFinal", 0, finalMax);

  if (quiz === null || mid === null || final === null) return;

  let midWeighted;
  let finalWeighted;

  if (gradeMode === "raw") {
    midWeighted = (mid / 400) * 35;
    finalWeighted = (final / 400) * 55;
  } else {
    midWeighted = mid;
    finalWeighted = final;
  }

  const total = quiz + midWeighted + finalWeighted;

  let grade;
  let className;

  if (total >= 80) {
    grade = "S*";
    className = "s-star";
  } else if (total >= 60) {
    grade = "S";
    className = "s";
  } else {
    grade = "U";
    className = "u";
  }

  const result = $("gradeResult");
  result.className = `result ${className}`;
  result.innerHTML = `
    <div class="result-title">Your result</div>
    <div class="result-main">
      <strong class="grade-big">${grade}</strong>
      <span>${fmt(total)} / 100</span>
    </div>
    <p class="result-detail">
      Quiz <span class="result-highlight">${fmt(quiz)}</span> +
      Midterm <span class="result-highlight">${fmt(midWeighted)}</span> / 35 +
      Final <span class="result-highlight">${fmt(finalWeighted)}</span> / 55
    </p>
  `;
  result.classList.remove("hidden");
});
