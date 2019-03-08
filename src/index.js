document.addEventListener("DOMContentLoaded", function(event) {
    let letterContainer = document.querySelector('#letter-container')
    let lifeContainer = document.querySelector('#life-container')
    let tailArr = []
    let livesArr = []
    let questionsArr = []
    let usersArr = []
    let scoresArr = []
    let answer = ""
    let direction = ""
    let usernameInput =''
    let questionContainer = document.querySelector("#question-container")
    let gameTitle = document.querySelector('#game-title')
    let answerContainer = document.querySelector("#answer-container")
    let pointsContainer = document.querySelector("#points-container")
    let lengthContainer = document.querySelector("#length-container")
    let scoreContainer = document.querySelector("#score-container")
    let winContainer = document.querySelector('#win-container')
    let leaderboard = document.querySelector('#leaderboard')
    let leaderboardHeader = document.querySelector('#leaderboard-header')
    let boardElement = ''
    let numberOfLetters = 15
    let collectLetterArr = []
    let letterIndex = 0
    let letterArr =[]
    let currentLocation = "#x-1-y-1"
    let looper = null
    let q = 0
    let user = null
    let score = 0
    let char = '<img src="./images/snake.png"/>'
    // var c = document.getElementById("myCanvas");
    // c.style.color = "green"
    // var ctx = c.getContext("2d");
    // ctx.fillRect(20, 20, 25, 25);
    // let char = ctx
    // let char = "🐍"
    let tail = '<img src="./images/snakeTail.png"/>'
    // document.createElement('img')
    // tail.src = `images/snakeTail.png`
    // let tail = "❎"
    let deathCondition = '<img src="./images/snakeTail.png">'
    // let deathCondition = "❎"
    let scream = new Audio("soundfx/scream.wav");
    let munch = new Audio("soundfx/munch.wav");
    let airHorn = new Audio("soundfx/airhorn.wav");
    let speed = 200
    const board = [];
    const boardWidth = 34, boardHeight = 23 ;
    let didIWIn = false

    // let deathCondition = "☠"
    getScores()
    function fetchQuestions() {
      fetch(`http://localhost:3000/api/v1/questions`)
      .then(r => r.json())
      .then(questions => {
        questionsArr = questions
        initGame()


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
        sortLeaderboard(scoresArr)
        gameTitle.innerHTML += "QUEZALCOATL"
        document.querySelector('#leaderboard-header').innerHTML += "Leaderboard"

        document.querySelector('#main').innerHTML = `
        <form id="username-form" method="POST">
         Username:<br>
         <input id="username" type="text">
         <br>
         <button type="submit">submit</button>
       </form>`
        usernameInput = document.querySelector('#username-form')
        usernameInput.addEventListener('submit', handleUsername)

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
      element.id = "list"
      let user = usersArr.find(u => u.id == score.user_id)
      element.innerHTML = `${user.username} - ${score.scoreValue}`
      leaderboard.appendChild(element)
    }
    function getRandomInt(minimum, max) {

      min = Math.ceil(minimum);
      max = Math.floor(max);
      return Math.floor(Math.random() * (max - min)) + min;
    }
    function appendQuestion(index) {
      questionContainer.innerHTML = questionsArr[index].content
      let blankAnswer = ""
      lengthContainer.innerHTML = "Answer Length: " + questionsArr[index].answer.length

      pointsContainer.dataset.id = questionsArr[index].points
      pointsContainer.innerHTML = `Question Value: ${pointsContainer.dataset.id}`

      answer = questionsArr[index].answer

      for (var i = 0; i < answer.length; i++) {
        document.querySelector(`#x-${getRandomInt(1, boardWidth - 1)}-y-${getRandomInt(1, boardHeight - 1)}`).innerHTML = answer[i]
      }
      for (var i = 0; i < answer.length; i++) {
        document.querySelector(`#x-${getRandomInt(1, boardWidth - 1)}-y-${getRandomInt(1, boardHeight - 1)}`).innerHTML = answer[i]
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
        document.querySelector(`#x-${getRandomInt(1, boardWidth - 1)}-y-${getRandomInt(1, boardHeight - 1)}`).innerHTML = generateRandomLetter()
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
      usernameInput.innerHTML = ""
      fetchQuestions()
    }
    function createUser(newUser) {
      //this makes sure the leaderboard will not show a blank name by a score
      if (newUser == ""){
        newUser = "Guest"
      }
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
      boardElement = document.querySelector('#board');
      boardElement.innerHTML = ""
      livesArr = []
      collectLetterArr=[]
      leaderboardHeader.innerHTML = ''
      lifeContainer.innerHTML = ""
      answerContainer.innerHTML = ""
      letterContainer.innerHTML = ""
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
        let questionIndex = getRandomInt(0, questionsArr.length)
        placeLetters()
        if (questionsArr.length > 0){
          console.log("length grEATER THAN 0");
          appendQuestion(questionIndex)
          questionsArr = questionsArr.filter(a => a.id != questionsArr[questionIndex].id);
          console.log(questionsArr);
        }
        else {
          questionsArr = [{id: 6, content: "Spell out the alphabet ... twice", points: 99999, answer: "ABCDEFGHIJKLMNOPQRSTUVWXYZABCDEFGHIJKLMNOPQRSTUVWXYZ"}]
          appendQuestion(0)
          console.log(questionsArr);
        }
        currentLocation = "#x-1-y-1"
        // debugger
        document.querySelector(currentLocation).innerHTML = char

        tailArr = []
        gameTitle.innerHTML = ""
        leaderboard.innerHTML = ''
        document.querySelector(`${currentLocation}`).innerHTML = char
        // document.querySelector(`${currentLocation}`).appendChild(char)
        document.addEventListener('keydown', handleMove)
    }
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
      didIWIn = false
      winContainer.innerHTML = ""
      if (e.keyCode == 32){
        clearInterval(looper)
      }

      if (e.key == "d" && direction != "left"){
        direction = "right"
        clearInterval(looper)
          looper =
          setInterval(function(){
            collectLetter()
            if (currentLocation.includes(`#x-${boardWidth - 2}`) ){
              addDeath()
              return ""
            }
            if (document.querySelector(currentLocation).innerHTML.includes(deathCondition)){
              addDeath()
              return ''
            }
            if (didIWIn == false){
              moveRight(e);
            }
          }, speed)
      }

      else if (e.key == "s" && direction != "up"){
        direction = "down"
        clearInterval(looper)
          looper =
          setInterval(function(){
            collectLetter()
            if (currentLocation.includes(`y-${boardHeight - 2}`) ){
              addDeath()
              return ""
            }
            if (document.querySelector(currentLocation).innerHTML.includes(deathCondition)){
              addDeath()
              return ''
            }
            if (didIWIn == false){
              moveDown(e);
            }
          }, speed)
      }

      else if (e.key == "a" && direction != "right"){
        direction = "left"
        clearInterval(looper)
          looper =
          setInterval(function(){
            collectLetter()
            if (currentLocation.includes(`x-${1}-`) ){
              addDeath()
              return ""
            }
            if (document.querySelector(currentLocation).innerHTML.includes(deathCondition)){
              addDeath()
              return ''
            }
            if (didIWIn == false){
              moveLeft(e);
            }

          }, speed)
      }

      else if (e.key == "w" && direction != "down"){
        direction = "up"
        clearInterval(looper)
          looper =
          setInterval(function(){
            collectLetter()
            if (currentLocation.endsWith(`y-${0}`) ){
              addDeath()
              return ""
            }
            if (document.querySelector(currentLocation).innerHTML.includes(deathCondition)){
              addDeath()
              return ""
            }
            if (didIWIn == false) {
              moveUp(e);
            }
          }, speed)
      }
    }
    function createTail(previousLocation) {
      let endTail = ''
      let alpharray = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"]

      document.querySelector(`${previousLocation}`).innerHTML = tail
      // debugger
      // document.querySelector(`${previousLocation}`).innerHTML = ""
      // document.querySelector(`${previousLocation}`).cloneNode(tail)
      // console.log(tail);
      // document.querySelector(`${previousLocation}`).appendChild(tail)
      tailArr.unshift(previousLocation)
      if (!alpharray.includes(document.querySelector(`${currentLocation}`).innerHTML[0])){
        endTail = tailArr.pop()
        document.querySelector(`${endTail}`).innerHTML = ''
      }
    }
    function collectLetter(){
      let letterString = ""
      if (document.querySelector(`${currentLocation}`).innerHTML.length > 30){
        munch.play();
        letterString = (document.querySelector(`${currentLocation}`).innerHTML[0])
        if (letterString !== "<") {
          letterContainer.innerHTML += letterString
          letterArr.push(letterString)
          speed -= 5
        }
      }
      letterString = (document.querySelector(`${currentLocation}`).innerHTML[0])
        if (letterString == answer[letterIndex]) {
          collectLetterArr.push(answer[letterIndex])
          letterIndex++
        }

      document.querySelector("#answer-container").innerHTML = collectLetterArr.join("")
      if (document.querySelector("#answer-container").innerHTML == answer ){
        airHorn.play()
        addPoints(document.querySelector("#points-container").dataset.id)
        displayWin()
        didIWIn = true
      }
    }
    function displayWin(){
      winContainer.innerHTML += "ROUND COMPLETE"
      initGame()
    }
    function addPoints(points) {
      score += parseInt(points)
      scoreContainer.innerHTML = `Your score: ${score}`
    }
    function addDeath(){
      scream.play();
      clearInterval(looper)
      document.querySelector(`${currentLocation}`).innerHTML = " "
      currentLocation = "#x-1-y-1"
      setCurrentSnakeLocation()
      lifeContainer.innerHTML += "☠️"
      speed = 200
      direction = ''

      livesArr.push("☠️")
      tailArr = []
      if (livesArr.length >= 3){
        boardElement.innerHTML = ""
        lifeContainer.innerHTML = ""
        answerContainer.innerHTML = ""
        letterContainer.innerHTML = ""
        questionContainer.innerHTML  = ''
        lengthContainer.innerHTML = ''
        pointsContainer.innerHTML = ''
        scoreContainer.innerHTML = ''
        direction = ''
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
        console.log(user
        );
        scoresArr.push(score)
        getScores()
      })
    }
  });
