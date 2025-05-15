let questions = [];

function fetchQuestions(){
    fetch("https://opentdb.com/api.php?amount=10&type=multiple")
    .then(response => response.json())
    .then(data => {
        questions = data.results.map(q => {
            const answers = [...q.incorrect_answers.map(a => ({text: decodeHTML(a), correct: false})), {text: decodeHTML(q.correct_answer), correct: true}];
            return {
                question: decodeHTML(q.question),
                answers: shuffleArray(answers)
            };
        });
        startQuiz();
    })
    .catch(error => {
        questionElement.innerHTML = "Error fetching questions. Please try again later.";
        console.error("Error fetching questions:", error);
    });
}

function decodeHTML(html){
    const txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
}

function shuffleArray(arr){
    return arr.sort(() => Math.random() - 0.5);
}

const questionElement = document.getElementById("question");
const  answerButtons = document.getElementById("answer-buttons");
const nextButton = document.getElementById("next-btn");

let currentQuestionIndex = 0;
let score = 0;

function startQuiz() {
    currentQuestionIndex = 0;
    score = 0;
    nextButton.innerHTML = "Next";
    showQuestion();
}

function showQuestion() {

    resetState();

    let currentQuestion = questions[currentQuestionIndex];
    let questionNo = currentQuestionIndex+1;
    questionElement.innerHTML = questionNo + ". " + currentQuestion.question;

    currentQuestion.answers.forEach(answer =>{
        const button = document.createElement("button");
        button.innerText = answer.text;
        button.classList.add("btn"); 
        answerButtons.appendChild(button);
        if(answer.correct){
            button.dataset.correct = answer.correct;
        }
        button.addEventListener("click", selectAnswer);
    })
}

function resetState(){
    nextButton.style.display = "none";
    while(answerButtons.firstChild){
        answerButtons.removeChild(answerButtons.firstChild);
    }
}

function selectAnswer(e){
    const selectedBtn = e.target;
    const isCorrect = selectedBtn.dataset.correct === 'true';
    if(isCorrect){
        selectedBtn.classList.add("correct");
        score++;
    } else {
        selectedBtn.classList.add("wrong");
    }
    Array.from(answerButtons.children).forEach(button => {
        if(button.dataset.correct === 'true'){
            button.classList.add("correct");
        }
        button.disabled = true;
    });
    nextButton.style.display = "block";
}

function showScore(){
    resetState();
    questionElement.innerHTML = `You scored ${score} out of ${questions.length}!`;
    nextButton.innerHTML = "Play Again";
    nextButton.style.display = "block";
}

function handleNextButton(){
    currentQuestionIndex++;
    if(currentQuestionIndex < questions.length){
        showQuestion();
    } else {
        showScore();
    }
}

nextButton.addEventListener("click", () => {
    if(currentQuestionIndex < questions.length){
        handleNextButton();
    }else{
        fetchQuestions();
    }
});

fetchQuestions();
