let currentQ = 0;
let score = 0;
let selectedValue = -1;

function renderQuestion() {
    const qObj = quizData[currentQ];
    const container = document.getElementById("questionContainer");
    container.innerHTML = `
        <div class="question-card" style="background: #1f2937; padding: 20px; border-radius: 8px; border-left: 5px solid var(--neon-blue); margin-bottom: 20px;">
            <h3>Q${currentQ + 1}: ${qObj.q}</h3>
            <div class="options-grid" style="display: grid; gap: 10px; margin-top: 15px;">
                <label class="option-label" onclick="selectOption(3, this)" style="background: #374151; padding: 15px; border-radius: 5px; cursor: pointer;">
                    <input type="radio" name="opt" value="3" style="display: none;"> Strongly Agree
                </label>
                <label class="option-label" onclick="selectOption(2, this)" style="background: #374151; padding: 15px; border-radius: 5px; cursor: pointer;">
                    <input type="radio" name="opt" value="2" style="display: none;"> Agree
                </label>
                <label class="option-label" onclick="selectOption(1, this)" style="background: #374151; padding: 15px; border-radius: 5px; cursor: pointer;">
                    <input type="radio" name="opt" value="1" style="display: none;"> Neutral
                </label>
                <label class="option-label" onclick="selectOption(0, this)" style="background: #374151; padding: 15px; border-radius: 5px; cursor: pointer;">
                    <input type="radio" name="opt" value="0" style="display: none;"> Disagree
                </label>
            </div>
        </div>
    `;
    document.getElementById("currentQNum").innerText = currentQ + 1;
    document.getElementById("totalQuestions").innerText = quizData.length;
    document.getElementById("progressFill").style.width = ((currentQ + 1) / quizData.length) * 100 + "%";
    document.getElementById("nextBtn").disabled = true;
}

function selectOption(val, element) {
    selectedValue = val;
    document.querySelectorAll('.option-label').forEach(el => {
        el.style.background = '#374151';
        el.style.borderColor = 'transparent';
    });
    element.style.background = '#1e3a8a';
    element.style.border = '1px solid var(--neon-blue)';
    document.getElementById("nextBtn").disabled = false;
}

function nextQuestion() {
    if (selectedValue === -1) return;
    score += selectedValue;
    selectedValue = -1;
    currentQ++;
    if (currentQ < quizData.length) {
        renderQuestion();
    } else {
        showResults();
    }
}

function showResults() {
    document.getElementById("quizSection").classList.add("hidden");
    document.getElementById("resultSection").classList.remove("hidden");
    
    const maxScore = quizData.length * 3;
    const percentage = (score / maxScore) * 100;
    
    let resultMsg = "";
    if (percentage >= 75) {
        resultMsg = `<h2 style="color: var(--neon-blue);">Excellent Match! 🚀</h2><p style="font-size: 1.1rem;">You scored <b>${Math.round(percentage)}%</b></p><br><p><b>${domainName}</b> seems like a perfect fit for your interests and aptitude!</p>`;
    } else if (percentage >= 50) {
        resultMsg = `<h2 style="color: #10b981;">Good Match 👍</h2><p style="font-size: 1.1rem;">You scored <b>${Math.round(percentage)}%</b></p><br><p>You have a solid interest in <b>${domainName}</b>. It's definitely worth exploring the roadmap further.</p>`;
    } else {
        resultMsg = `<h2 style="color: #f59e0b;">Low Match 🤔</h2><p style="font-size: 1.1rem;">You scored <b>${Math.round(percentage)}%</b></p><br><p>This domain might not align perfectly with your core interests, but you can always explore the basics to be sure!</p>`;
    }

    document.getElementById("primaryResultText").innerHTML = resultMsg + 
        `<br><br><div style="text-align:center;"><a href="${domainLink}" class="btn">Return to ${domainName} Details</a></div>`;
}

document.addEventListener("DOMContentLoaded", () => {
    if (typeof quizData !== 'undefined') {
        renderQuestion();
    }
});
