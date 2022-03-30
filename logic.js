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
  var turn
  var instruction = document.querySelector('h3')
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
      const coord = document.createElement('div') //the offical name for the squares is co-ordinates, so i chose to change these to coord.
      coord.classList.add('square') //left this name alone because i didn't want to mess things up.
      coord.dataset.id = i
      grid.appendChild(coord)
      squares.push(coord)
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

      if (food.name === "bread")
      {
        if(direction === 10)
        {
          userSquares[randomStart].classList.add('bread-vertical', 'square')
        }
        if(direction === 1)
        {
          userSquares[randomStart].classList.add('bread-horizontal', 'square')
        }
      }
      
      if (food.name === "pocky")
      {
        if(direction === 10)
        {
          userSquares[randomStart].classList.add('pocky-vertical', 'square')
        }
        if direction === 1)
        {
          userSquares[randomStart].classList.add('pocky-horizontal', 'square')
        }
      }

      if (food.name === "bento")
      {
        if(direction === 10)
        {
          userSquares[randomStart].classList.add('bento-vertical', 'square')
        }
        if(direction === 1)
        {
          userSquares[randomStart].classList.add('bento-horizontal', 'square')
        }
      }
      
      if (food.name === "donut")
      {
        if(direction === 10)
        {
          userSquares[randomStart].classList.add('donut-vertical', 'square')
        }
        if(direction === 1)
        {
          userSquares[randomStart].classList.add('donut-horizontal', 'square')
        }
      }
      
      if (food.name === "pizza")
      {
        if(direction === 10)
        {
          userSquares[randomStart].classList.add('pizza-vertical', 'square')
        }
        if(direction === 1)
        {
          userSquares[randomStart].classList.add('pizza-horizontal', 'square')
        }
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
    hide.remove()
    turn = document.createElement("b")
    turn.innerText = "YOUR TURN"
    instruction.append(turn)
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
    // Loop for the game until someone score 25
    computerSquares.forEach(cell => cell.addEventListener('click', () => {
          shotFired = cell.dataset.id
          if (cell.classList.contains('taken'))
          {
            cell.classList.add('hit')
          }
          else {
            cell.classList.add('miss')
          }
      }))
  }

})
