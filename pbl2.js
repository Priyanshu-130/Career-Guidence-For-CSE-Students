function showDomains() {
    document.getElementById("domainSection").classList.remove("hidden");
    document.getElementById("quizSection").classList.add("hidden");
}

function startQuiz() {
    document.getElementById("quizSection").classList.remove("hidden");
    document.getElementById("domainSection").classList.add("hidden");
    loadQuestions();
}

function loadQuestions() {
    const questions = [
        "When your phone has an issue, you:",
        "In a project, you prefer to:",
        "You enjoy solving:",
        "You like learning about:",
        "Your strength is:",
        "You prefer tasks that are:",
        "Which tool interests you?",
        "You like working with:",
        "You would enjoy a job where you:",
        "You are curious about:",
        "In free time, you prefer:",
        "You enjoy improving:"
    ];

    const options = [
        ["Understand cause","Fix apps","Check virus","Restart system"],
        ["Analyze data","Build features","Check security","Manage systems"],
        ["Logical problems","Design challenges","Security issues","System errors"],
        ["AI & data","Apps/web","Cyber threats","Cloud systems"],
        ["Logic","Creativity","Attention to detail","Technical setup"],
        ["Analytical","Creative","Protective","Technical"],
        ["Data tools","Web tools","Security tools","Cloud tools"],
        ["Numbers","Designs","Safety systems","Networks"],
        ["Predict outcomes","Develop software","Stop attacks","Manage servers"],
        ["AI systems","App design","Cyber laws","Cloud platforms"],
        ["Brain puzzles","Designing","Security tips","System settings"],
        ["Accuracy","User experience","Safety","Performance"]
    ];

    const form = document.getElementById("quizForm");
    form.innerHTML = "";

    questions.forEach((q, i) => {
        form.innerHTML += `<p>${i+1}. ${q}</p>`;
        ["A","B","C","D"].forEach((letter,j) => {
            form.innerHTML += `<label><input type="radio" name="q${i+1}" value="${letter}"> ${options[i][j]}</label>`;
        });
    });
}

function showResult() {
    let scores = {A:0,B:0,C:0,D:0};
    const form = document.forms["quizForm"];

    for(let i=1;i<=12;i++){
        let ans = form["q"+i].value;
        scores[ans]++;
    }

    let best = Object.keys(scores).reduce((a,b)=>scores[a]>scores[b]?a:b);
    let map = {A:"AI & Data Science",B:"Web & App Development",C:"Cyber Security",D:"Cloud & Networking"};

    document.getElementById("resultText").innerText = "You are best suited for: " + map[best];
    document.getElementById("resultSection").classList.remove("hidden");

    new Chart(document.getElementById("chart"),{
        type:'bar',
        data:{
            labels:["AI/Data","Web/App","Cyber","Cloud"],
            datasets:[{
                label:"Interest Score",
                data:[scores.A,scores.B,scores.C,scores.D],
                backgroundColor:["#3b82f6","#10b981","#ef4444","#f59e0b"]
            }]
        }
    });
}
