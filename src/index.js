let letterContainer = document.querySelector('#letter-container')
let lifeContainer = document.querySelector('#life-container')
// let letterString = ''
let tailArr = []
let livesArr = []
let answer = ""
let questionContainer = document.querySelector("#question-container")
let answerContainer = document.querySelector("#answer-container")
let pointsContainer = document.querySelector("#points-container")
let lengthContainer = document.querySelector("#length-container")
let numberOfLetters = 200
let collectLetterArr = []

let scream = new Audio("soundfx/scream.wav"); // buffers automatically when created
let munch = new Audio("soundfx/munch.wav"); // buffers automatically when created

let speed = 60
const board = [];
// fullscreen is 56x56 but it too big myan
const boardWidth = 34, boardHeight = 23 ;

function initGame() {

  console.log("im here");
  fetchQuestion()
  const boardElement = document.getElementById('board');
  boardElement.innerHTML = ""
  livesArr = []
  collectLetterArr=[]
   lifeContainer.innerHTML = ""

    for (var y = 0; y < boardHeight; ++y) {
        var row = [];
        for (var x = 0; x < boardWidth; ++x) {
            var cell = {};

            cell.element = document.createElement('div');
            cell.element.id =  "x" + "-" + x + "-" + "y" + "-" + y

            if (cell.element.id.includes(`x-0`)){
              cell.element.style.backgroundColor = "#CE1569"
            }

            if (cell.element.id.includes(`y-0`)){
              cell.element.style.backgroundColor = "#CE1569"
            }

            if (cell.element.id.includes(`x-${boardWidth - 1}`)){
              cell.element.style.backgroundColor = "#CE1569"
            }

            if (cell.element.id.includes(`y-${boardHeight - 1}`)){
              cell.element.style.backgroundColor = "#CE1569"
            }
            boardElement.appendChild(cell.element);
            row.push(cell);
        }
        board.push(row);
    }
    placeLetters()
    tailArr = []
}
initGame()
let currentLocation = "#x-1-y-1"
document.addEventListener('keydown', handleMove)
document.querySelector(currentLocation).innerHTML = "😸"

function moveRight(e){
  let previousLocation = currentLocation

  val = currentLocation.split("-")
  val[1]++
  currentLocation = `${val[0]}-${val[1]}-${val[2]}-${val[3]}`
  document.querySelector(`${currentLocation}`).innerHTML += "😸"
    createTail(previousLocation)
}
function moveDown(e){
  let previousLocation = currentLocation

  val = currentLocation.split("-")
  val[3]++
  currentLocation = `${val[0]}-${val[1]}-${val[2]}-${val[3]}`
  document.querySelector(`${currentLocation}`).innerHTML += "😸"
  createTail(previousLocation)
}
function moveLeft(e){

  let previousLocation = currentLocation
  val = currentLocation.split("-")
  val[1]--
  currentLocation = `${val[0]}-${val[1]}-${val[2]}-${val[3]}`
  document.querySelector(`${currentLocation}`).innerHTML += "😸"
  createTail(previousLocation)
}
function moveUp(e){
  let previousLocation = currentLocation

  val = currentLocation.split("-")
  val[3]--
  currentLocation = `${val[0]}-${val[1]}-${val[2]}-${val[3]}`
  document.querySelector(`${currentLocation}`).innerHTML += "😸"
  createTail(previousLocation)
}
let looper = null
function handleMove(e){
  if (e.keyCode == 32){
    clearInterval(looper)
  }

  if (e.key == "ArrowRight"){
    clearInterval(looper)
      looper =
      setInterval(function(){
        collectLetter()
        if (currentLocation.includes(`#x-${boardWidth - 2}`) ){

        addDeath()
          return ""
        }
        if (document.querySelector(currentLocation).innerHTML[0] == "☠"){
          addDeath()
        }
        moveRight(e);

      }, speed)

  }

  else if (e.key == "ArrowDown"){
    clearInterval(looper)
      looper =
      setInterval(function(){

        collectLetter()
        if (currentLocation.includes(`${boardHeight - 2}`) ){
        addDeath()
          return ""
        }
        if (document.querySelector(currentLocation).innerHTML[0] == "☠"){
          addDeath()
        }
        moveDown(e);
      }, speed)

  }

  else if (e.key == "ArrowLeft"){
    clearInterval(looper)

      looper =
      setInterval(function(){
        collectLetter()
        if (currentLocation.includes(`x-${1}-`) ){
        addDeath()
          return ""
        }
        if (document.querySelector(currentLocation).innerHTML[0] == "☠"){
          addDeath()
        }
        moveLeft(e);
      }, speed)


  }

  else if (e.key == "ArrowUp"){


    clearInterval(looper)
      looper =
      setInterval(function(){
        collectLetter()
        if (currentLocation.endsWith(`y-${1}`) ){
        addDeath()
          return ""
        }
        console.log(document.querySelector(currentLocation).innerHTML);
        if (document.querySelector(currentLocation).innerHTML[0] == "☠"){
          addDeath()
        }
        moveUp(e);

      }, speed)
  }
}
function createTail(previousLocation) {
  let endTail = ''
  let alpharray = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"]

  document.querySelector(`${previousLocation}`).innerHTML = "☠️"
  tailArr.unshift(previousLocation)
  console.log(tailArr);
  console.log(document.querySelector(`${currentLocation}`).innerHTML[0]);
    if (alpharray.includes(document.querySelector(`${currentLocation}`).innerHTML[0])){
      console.log("YOU HIT A LETTER!!");
      //document.querySelector(`${tailArr[1]}`).innerHTML = "☠️"
    }
    else{
      console.log("no letter");
      endTail = tailArr.pop()
      console.log(endTail)
      document.querySelector(`${endTail}`).innerHTML = ''
      //document.querySelector(`${alpharray[1]}`).innerHTML = "☠️"
    }
}

function setCurrentSnakeLocation() {
  document.querySelector(`${currentLocation}`).innerHTML = "😸"
}
function getRandomInt(max) {

  min = Math.ceil(1);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}
function generateRandomLetter() {
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

  for (var i = 0; i < 1; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));

  return text;
}
function placeLetters(){

  for (var i = 0; i < numberOfLetters; i++) {
    document.querySelector(`#x-${getRandomInt(boardWidth - 1)}-y-${getRandomInt(boardHeight - 1)}`).innerHTML = generateRandomLetter()
  }
}

function collectLetter(){
  let letterString = ""

  if (document.querySelector(`${currentLocation}`).innerHTML.length > 2){
    munch.play();
    letterContainer.innerHTML += document.querySelector(`${currentLocation}`).innerHTML[0]
    letterString = (document.querySelector(`${currentLocation}`).innerHTML[0])
    // letterString += (document.querySelector(`${currentLocation}`).innerHTML[0])
    console.log(letterContainer);
  }
  letterString = (document.querySelector(`${currentLocation}`).innerHTML[0])
  for (var i = 0; i < answer.length; i++) {
    if (letterString == answer[i]) {
      collectLetterArr.push(answer[i])
    }
  }
  document.querySelector("#answer-container").innerHTML = collectLetterArr.join("")
  if (document.querySelector("#answer-container").innerHTML == answer ){

    console.log("YOU WINN!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")
    initGame()
  }
}

function addDeath(){
  scream.play();
  clearInterval(looper)
  document.querySelector(`${currentLocation}`).innerHTML = " "

  currentLocation = "#x-1-y-1"
  setCurrentSnakeLocation()
  lifeContainer.innerHTML += "☠️"
  livesArr.push("☠️")
  tailArr = []
  if (livesArr.length >= 3){
    initGame()
  }
}

function fetchQuestion() {
  fetch(`http://localhost:3000/api/v1/questions`)
  .then(r => r.json())
  .then(question => appendQuestion(question))
}


function appendQuestion(question) {
  questionContainer.innerHTML = question[0].content + "?"
  let blankAnswer = ""
  // for (var i = 0; i < question[0].answer.length; i++) {
  //   blankAnswer += "_ "
  // }
  // answerContainer.innerHTML = blankAnswer
  lengthContainer.innerHTML = "Answer Length: " + question[0].answer.length
  pointsContainer.innerHTML = question[0].points
  answer = question[0].answer
  for (var i = 0; i < answer.length; i++) {
    document.querySelector(`#x-${getRandomInt(boardWidth - 1)}-y-${getRandomInt(boardHeight - 1)}`).innerHTML = answer[i]
  }
}
