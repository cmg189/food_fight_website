document.addEventListener('DOMContentLoaded', () => {
  const userGrid = document.querySelector('.grid-user')
  var computerGrid
  const userSquares = []
  const computerSquares = []
  const width = 10
  const readyButton = document.querySelector('#ready')
  const reposition = document.querySelector('#reposition')
  const rightCon = document.querySelector('.right-container')
  const centerCon = document.querySelector('.vertical-center')


	const hide = document.querySelector('#hide')
  var turn = 'user'
  var dispTurn //Created to be used instead of 'turn' for displaying the turn change. -NoVA
	var instruction = document.querySelector('h3')

	//var body = document.querySelector('.container')
	var bot = document.querySelector('#bot')
	var you = document.querySelector('#you')


	var userScore = 0
  var botScore = 0
  var shotFired


  const foodArray = [
    {
      name: 'bread',
      dimension: 1,
      myLength: 3,
      directions: [
        [0, 1, 2], // horizontal
        [0, width, width*2] // vertical
      ]
    },
    {
      name: 'pocky',
      dimension: 1,
      myLength: 3,
      directions: [
        [0, 1, 2], // horizontal
        [0, width, width*2] // vertical
      ]
    },
    {
      name: 'bento',
      dimension: 2,
      myLength: 3,
      directions: [
        [0, 1, 2, width, width+1, width+2], // horizontal
        [0, 1, width, width+1, width*2, width*2+1] // vertical
      ]
    },
    {
      name: 'donut',
      dimension: 2,
      myLength: 2,
      directions: [
        [0, 1, width, width+1], // horizontal
        [0, 1, width, width+1] // vertical
      ]
    },
    {
      name: 'pizza',
      dimension: 3,
      myLength: 3,
      directions: [
        [0, 1, 2, width, width+1, width+2, width*2, width*2 + 1, width*2 + 2], // horizontal
        [0, 1, 2, width, width+1, width+2, width*2, width*2 + 1, width*2 + 2] // vertical
      ]
    }
  ]

  function createBoard(grid, squares) { // grid: userGrid or computerGrid; squares is an empty array
    for (let i = 0; i < width*width; i++) {
      const square = document.createElement('div')
      square.classList.add('square')
      square.dataset.id = i
      grid.appendChild(square)
      squares.push(square)
    }
  }

  createBoard(userGrid, userSquares)

  function generate(food) { // User's food
    let randomDirection = Math.floor(Math.random() * food.directions.length) // 0 or 1
    let randomStart
    // console.log(randomDirection)
    let current = food.directions[randomDirection] // array containing directions
    if (randomDirection === 0) direction = 1 // horizontal
    if (randomDirection === 1) direction = 10 // vertical
    if (food.dimension === 2)
    {
      if (direction === 1)
      {
        randomStart = Math.abs(Math.floor(Math.random() * userSquares.length - (food.myLength * direction + width)))
      }
      else
      {
        randomStart = Math.abs(Math.floor(Math.random() * userSquares.length - (food.myLength * direction + 1)))
      }
    }
    else if (food.dimension === 3)
    {
      if (direction === 1)
      {
        randomStart = Math.abs(Math.floor(Math.random() * userSquares.length - (food.myLength * direction + 2*width)))
      }
      else
      {
        randomStart = Math.abs(Math.floor(Math.random() * userSquares.length - (food.myLength * direction + 2)))
      }
    }
    else {
      randomStart = Math.abs(Math.floor(Math.random() * userSquares.length - (food.myLength * direction)))
    }

    const isTaken = current.some(index => userSquares[randomStart + index].classList.contains('taken'))
    const isAtRightEdge = current.some(index => (randomStart + index) % width === width - 1)
    const isAtLeftEdge = current.some(index => (randomStart + index) % width === 0)

    if (!isTaken && !isAtRightEdge && !isAtLeftEdge)
    {
      current.forEach(index => userSquares[randomStart + index].classList.add('taken', food.name))
      current.forEach(index => userSquares[randomStart + index].classList.remove('square'))

      if (food.name === "bread" && direction === 10)
      {
        userSquares[randomStart].classList.add('bread-vertical', 'square')
      }
      if (food.name === "bread" && direction === 1)
      {
        userSquares[randomStart].classList.add('bread-horizontal', 'square')
      }

      if (food.name === "pocky" && direction === 10)
      {
        userSquares[randomStart].classList.add('pocky-vertical', 'square')
      }
      if (food.name === "pocky" && direction === 1)
      {
        userSquares[randomStart].classList.add('pocky-horizontal', 'square')
      }

      if (food.name === "bento" && direction === 10)
      {
        userSquares[randomStart].classList.add('bento-vertical', 'square')
      }
      if (food.name === "bento" && direction === 1)
      {
        userSquares[randomStart].classList.add('bento-horizontal', 'square')
      }

      if (food.name === "donut" && direction === 10)
      {
        userSquares[randomStart].classList.add('donut-vertical', 'square')
      }
      if (food.name === "donut" && direction === 1)
      {
        userSquares[randomStart].classList.add('donut-horizontal', 'square')
      }

      if (food.name === "pizza" && direction === 10)
      {
        userSquares[randomStart].classList.add('pizza-vertical', 'square')
      }
      if (food.name === "pizza" && direction === 1)
      {
        userSquares[randomStart].classList.add('pizza-horizontal', 'square')
      }
    }

    else
    {
      generate(food)
    }
  }

  //const bread = document.createElement('div')
  //bread.setAttribute("class", "bread")
  //bread.setAttribute("draggable", "true")

  generate(foodArray[0]) // generate bread on the board
  generate(foodArray[1])
  generate(foodArray[2])
  generate(foodArray[3])
  generate(foodArray[4])

  readyButton.addEventListener('click', () => {
    userGrid.remove()
    rightCon.append(userGrid)
    userGrid.style.transform = 'scale(0.7)'
    readyButton.style.display = 'none'
    reposition.style.display = 'none'
    computerGrid = document.createElement("div")
    computerGrid.classList.add('battleship-grid', 'grid-computer')
    centerCon.insertBefore(computerGrid, readyButton)
    createBoard(computerGrid, computerSquares)
    generateEnemy(foodArray[0]) // generate bread on the board
    generateEnemy(foodArray[1])
    generateEnemy(foodArray[2])
    generateEnemy(foodArray[3])
    generateEnemy(foodArray[4])


    hide.remove() // remove the "HIDE YOUR FOOD" text

		// display images for turn status
		bot.style.opacity = "1"
		you.style.opacity = "1"

    gameLogic()
  })

  function generateEnemy(food) { // Computer's food
    let randomDirection = Math.floor(Math.random() * food.directions.length) // 0 or 1
    let randomStart
    // console.log(randomDirection)
    let current = food.directions[randomDirection] // array containing directions
    if (randomDirection === 0) direction = 1 // horizontal
    if (randomDirection === 1) direction = 10 // vertical
    if (food.dimension === 2)
    {
      if (direction === 1)
      {
        randomStart = Math.abs(Math.floor(Math.random() * computerSquares.length - (food.myLength * direction + width)))
      }
      else
      {
        randomStart = Math.abs(Math.floor(Math.random() * computerSquares.length - (food.myLength * direction + 1)))
      }
    }
    else if (food.dimension === 3)
    {
      if (direction === 1)
      {
        randomStart = Math.abs(Math.floor(Math.random() * computerSquares.length - (food.myLength * direction + 2*width)))
      }
      else
      {
        randomStart = Math.abs(Math.floor(Math.random() * computerSquares.length - (food.myLength * direction + 2)))
      }
    }
    else {
      randomStart = Math.abs(Math.floor(Math.random() * computerSquares.length - (food.myLength * direction)))
    }

    const isTaken = current.some(index => computerSquares[randomStart + index].classList.contains('taken'))
    const isAtRightEdge = current.some(index => (randomStart + index) % width === width - 1)
    const isAtLeftEdge = current.some(index => (randomStart + index) % width === 0)

    if (!isTaken && !isAtRightEdge && !isAtLeftEdge)
    {
      current.forEach(index => computerSquares[randomStart + index].classList.add('taken', food.name))
    }
    else
    {
      generateEnemy(food)
    }
  }

	function gameLogic()
  {
		//console.log("top:", turn);

	if(userScore < 25 && botScore < 25){

		if(turn === 'user'){
			//console.log("in user");
			computerSquares.forEach(cell => cell.addEventListener('click', () => {
				//console.log("CLICK");
				document.getElementById('bot_img').src="images/bot_turn.png"
				document.getElementById('you_img').src="images/you.png"

				shotFired = cell.dataset.id
					if (cell.classList.contains('taken') && !cell.classList.contains('hit') && !cell.classList.contains('miss'))
					{
						// exe when a hit
						document.getElementById('bot_img').src="images/bot.png"
						document.getElementById('you_img').src="images/your_turn.png"

						cell.classList.add('hit')
						userScore = userScore + 1;
					}
					else if (!cell.classList.contains('hit') && !cell.classList.contains('miss')) {
						// exe when miss
						document.getElementById('bot_img').src="images/bot_turn.png"
						document.getElementById('you_img').src="images/you.png"
						cell.classList.add('miss')
					}
				//console.log("end of user");
				turn = 'bot';

				gameLogic(); //This recursive call is REQUIRED* to get to the bot turn

			}))
		}
		if(turn === 'bot') //maybe should be an else if? I don't think so, though.
		{
			//console.log("in bot");
			var zone;  //bot chooses a target at random that is on the board.
			//do while loop to make sure that cpu doesn't attack a target it already hit. does NOT check if inbounds or not.
			do {
				zone = Math.floor( Math.random() * userSquares.length); //zone is the cpu's target.
			}
			while(userSquares[zone].classList.contains('hit') || userSquares[zone].classList.contains('miss'));

			if(userSquares[zone].classList.contains('taken'))
			{
				//if the cell/zone/spot is taken, make it hit.
				userSquares[zone].classList.add('hit');
				botScore = botScore + 1;
			}
			else {
				userSquares[zone].classList.add('miss');
			}
			//Possibly need to Check if its in bounds? Seems like it can't even go out of bounds.
			turn = 'user';
			//console.log("end of bot");
		}
	} //if game is on (both scores < 25)
	else if (userScore >= 25 && userScore > botScore) {
		winMsg();  //user wins
	}
	else if (botScore >= 25) {
		loseMsg(); //computer wins
	}
	else {
		//Error.
	}

}// gamelogic()

  // Get the modal
  var modal = document.getElementById("myModal");

  // Get the button that opens the modal
  //var winBtn = document.getElementById("winBtn");
  //var loseBtn = document.getElementById("loseBtn");

  var message = document.getElementById("message");
  var box = document.getElementById("modal-box");

  // Get the <span> element that closes the modal
  var span = document.getElementsByClassName("close")[0];

  // When the user clicks the button, open the modal
  //winBtn.onclick = function() {
  function winMsg() {
    modal.style.display = "block";
    message.innerText = "YOU WON";
    box.classList.add('winning');
  }

  //loseBtn.onclick = function() {
  function loseMsg() {
    modal.style.display = "block";
    message.innerText = "YOU LOST";
    box.classList.add('losing');
  }

})
