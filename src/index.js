document.addEventListener("DOMContentLoaded", function(event) {
    console.log("DOM fully loaded and parsed");
    let letterContainer = document.querySelector('#letter-container')
    let lifeContainer = document.querySelector('#life-container')
    let tailArr = []
    let livesArr = []
    let questionsArr = []
    let usersArr = []
    let scoresArr = []
    let answer = ""
    let questionContainer = document.querySelector("#question-container")
    let answerContainer = document.querySelector("#answer-container")
    let pointsContainer = document.querySelector("#points-container")
    let lengthContainer = document.querySelector("#length-container")
    let scoreContainer = document.querySelector("#score-container")
    let winContainer = document.querySelector('#win-container')
    let leaderboard = document.querySelector('#leaderboard')
    let userForm = document.querySelector('#username-form')
    let numberOfLetters = 15
    let collectLetterArr = []
    let letterIndex = 0
    let letterArr =[]
    let currentLocation = "#x-1-y-1"
    let looper = null
    let q = 0
    let user = 1
    let score = 0
    let char = "🐍"
    let tail = "❎"
    let deathCondition = "❎"
    let scream = new Audio("soundfx/scream.wav");
    let munch = new Audio("soundfx/munch.wav");
    let speed = 200
    const board = [];
    const boardWidth = 34, boardHeight = 23 ;
    let usernameInput = document.querySelector('#username-form')
    usernameInput.addEventListener('submit', handleUsername)

    // let deathCondition = "☠"
    fetchQuestions()
    function fetchQuestions() {
      fetch(`http://localhost:3000/api/v1/questions`)
      .then(r => r.json())
      .then(questions => {
        questionsArr = questions
        getScores()
      })
    }
    function getScores() {
      fetch(`http://localhost:3000/api/v1/scores`)
      .then(r => r.json())
      .then(scores => {
        scoresArr = scores
        getUsers()
        // sortLeaderboard(scores)
      })
    }
    function getUsers() {
      fetch(`http://localhost:3000/api/v1/users`)
      .then(r => r.json())
      .then(users => {
        usersArr = users
        initGame()
      })
    }
    function sortLeaderboard(scores) {

      sort = scores.sort((a,b) => b.scoreValue - a.scoreValue)
      loopThroughScores(sort)
    }
    function loopThroughScores(scores) {
      for (let i = 0; i < 10; i++){
        renderScore(scores[i])
      }
    }
    function renderScore(score) {

      let element = document.createElement(`li`)
      let user = usersArr.find(u => u.id == score.user_id)
      element.innerHTML = `${user.username} - ${score.scoreValue}`
      leaderboard.appendChild(element)
    }
    function getRandomInt(max) {

      min = Math.ceil(1);
      max = Math.floor(max);
      return Math.floor(Math.random() * (max - min)) + min;
    }
    function appendQuestion(index) {
      questionContainer.innerHTML = questionsArr[index].content
      let blankAnswer = ""
      lengthContainer.innerHTML = "Answer Length: " + questionsArr[index].answer.length
      pointsContainer.innerHTML = questionsArr[index].points
      answer = questionsArr[index].answer

      for (var i = 0; i < answer.length; i++) {
        document.querySelector(`#x-${getRandomInt(boardWidth - 1)}-y-${getRandomInt(boardHeight - 1)}`).innerHTML = answer[i]
      }

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
    function handleUsername(e){
      e.preventDefault()
      let inputUser = document.querySelector("#username").value
      if (usersArr.find(u => u.username == inputUser)) {
        user = usersArr.find(u => u.username == inputUser)
        user = user.id
      }
      else {
        createUser(inputUser)
      }
      userForm.innerHTML = ""
    }
    function createUser(newUser) {
      fetch(`http://localhost:3000/api/v1/users`,{
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json"
        },
        body: JSON.stringify({
          username: newUser
        })
      })
      .then(r => r.json())
      .then(createdUser => {
        usersArr.push(createdUser)
        user = createdUser.id
      })
    }
    function initGame() {

      const boardElement = document.querySelector('#board');
      boardElement.innerHTML = ""
      livesArr = []
      collectLetterArr=[]
      lifeContainer.innerHTML = ""
      answerContainer.innerHTML = ""
      letterContainer.innerHTML = ""
      // leaderboard.innerHTML = ""
      letterIndex = 0


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
        clearInterval(looper)
        speed = 200
        let questionIndex = getRandomInt(questionsArr.length)
        appendQuestion(questionIndex)
        questionsArr = questionsArr.filter(a => a.id != questionsArr[questionIndex].id);
        console.log(questionsArr);
        currentLocation = "#x-1-y-1"
        document.querySelector(currentLocation).innerHTML = char
        placeLetters()
        tailArr = []

        leaderboard.innerHTML = ''
        sortLeaderboard(scoresArr)

    }
    document.addEventListener('keydown', handleMove)
    function setCurrentSnakeLocation() {
      document.querySelector(`${currentLocation}`).innerHTML = char
    }
    function moveRight(e){
      let previousLocation = currentLocation

      val = currentLocation.split("-")
      val[1]++
      currentLocation = `${val[0]}-${val[1]}-${val[2]}-${val[3]}`
      document.querySelector(`${currentLocation}`).innerHTML += char
        createTail(previousLocation)
    }
    function moveDown(e){
      let previousLocation = currentLocation

      val = currentLocation.split("-")
      val[3]++
      currentLocation = `${val[0]}-${val[1]}-${val[2]}-${val[3]}`
      document.querySelector(`${currentLocation}`).innerHTML += char
      createTail(previousLocation)
    }
    function moveLeft(e){

      let previousLocation = currentLocation
      val = currentLocation.split("-")
      val[1]--
      currentLocation = `${val[0]}-${val[1]}-${val[2]}-${val[3]}`
      document.querySelector(`${currentLocation}`).innerHTML += char
      createTail(previousLocation)
    }
    function moveUp(e){
      let previousLocation = currentLocation
      val = currentLocation.split("-")
      val[3]--
      currentLocation = `${val[0]}-${val[1]}-${val[2]}-${val[3]}`
      document.querySelector(`${currentLocation}`).innerHTML += char
      createTail(previousLocation)
    }
    function handleMove(e){
      winContainer.innerHTML = ""
      if (e.keyCode == 32){
        clearInterval(looper)
      }

      if (e.key == "d"){
        clearInterval(looper)
          looper =
          setInterval(function(){
            collectLetter()
            if (currentLocation.includes(`#x-${boardWidth - 2}`) ){
              addDeath()
              return ""
            }
            if (document.querySelector(currentLocation).innerHTML[0] == deathCondition){
              addDeath()
            }
            moveRight(e);
          }, speed)
      }

      else if (e.key == "s"){
        clearInterval(looper)
          looper =
          setInterval(function(){
            collectLetter()
            if (currentLocation.includes(`${boardHeight - 2}`) ){
              addDeath()
              return ""
            }
            if (document.querySelector(currentLocation).innerHTML[0] == deathCondition){
              addDeath()
            }
            moveDown(e);
          }, speed)
      }

      else if (e.key == "a"){
        clearInterval(looper)
          looper =
          setInterval(function(){
            collectLetter()
            if (currentLocation.includes(`x-${1}-`) ){
              addDeath()
              return ""
            }
            if (document.querySelector(currentLocation).innerHTML[0] == deathCondition){
              addDeath()
            }
            moveLeft(e);
          }, speed)
      }

      else if (e.key == "w"){
        clearInterval(looper)
          looper =
          setInterval(function(){
            collectLetter()
            if (currentLocation.endsWith(`y-${1}`) ){
              addDeath()
              return ""
            }
            if (document.querySelector(currentLocation).innerHTML[0] == deathCondition){
              addDeath()
            }
            moveUp(e);
          }, speed)
      }
    }
    function createTail(previousLocation) {
      let endTail = ''
      let alpharray = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"]

      document.querySelector(`${previousLocation}`).innerHTML = tail
      tailArr.unshift(previousLocation)
      if (!alpharray.includes(document.querySelector(`${currentLocation}`).innerHTML[0])){
        endTail = tailArr.pop()
        document.querySelector(`${endTail}`).innerHTML = ''
      }
    }
    function collectLetter(){
      let letterString = ""
      if (document.querySelector(`${currentLocation}`).innerHTML.length > 2){
        munch.play();
        letterString = (document.querySelector(`${currentLocation}`).innerHTML[0])
        letterContainer.innerHTML += letterString
        letterArr.push(letterString)
        speed -= 5
      }
      letterString = (document.querySelector(`${currentLocation}`).innerHTML[0])
        if (letterString == answer[letterIndex]) {
          collectLetterArr.push(answer[letterIndex])
          letterIndex++
        }

      document.querySelector("#answer-container").innerHTML = collectLetterArr.join("")
      if (document.querySelector("#answer-container").innerHTML == answer ){
        displayWin()
        addPoints(document.querySelector("#points-container").innerText)
      }
    }
    function displayWin(){
      winContainer.innerHTML += "ROUND COMPLETE"
      initGame()
    }
    function addPoints(points) {
      score += parseInt(points)
      scoreContainer.innerHTML = `Score: ${score}`
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
        // death message and highscore postage
        postScore()
      }
    }
    function postScore() {
      fetch(`http://localhost:3000/api/v1/scores`,{
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json"
        },
        body: JSON.stringify({
          scoreValue: score,
          user_id: user
        })
      })
      .then(r => r.json())
      .then(score => {
        scoresArr.push(score)
        initGame()
      })
    }

  });
