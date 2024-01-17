import './App.css';
import {useState} from 'react'
import confetti from 'canvas-confetti'
import { Square } from './components/Square.jsx';
import {TURNS, WINNER_COMBOS} from './constants.js'



//IMPORTANTISIMO: LOS ESTADOS EN REACT SON ASINCRONOS

function App() {

//Tablero
const [board, setBoard] = useState(() => {

  //Buscamos en el localStorage si hay un tablero guardado, de ser asi inicia donde se dejo
  //sino se crea uno nuevo como tenemos, Array(9).fill(null)
  const boardFromStorage = window.localStorage.getItem('board')
  return boardFromStorage ? JSON.parse(boardFromStorage) : Array(9).fill(null)
})

//Turnos
const [turn, setTurn] = useState(() => {
  const turnFromLocalStorage = window.localStorage.getItem('turn')
  return turnFromLocalStorage ?? TURNS.X
})

//Ganador
const [winner, setWinner] = useState(null) //Null no ganador, false es empate

//chequear ganador
// Se revisan todas las combinaciones ganadoras 
const checkWinner = (boardToCheck) => {
  for ( const combo of WINNER_COMBOS ) {
    const [a, b, c] = combo
    if(
      boardToCheck[a] && 
      boardToCheck[a] === boardToCheck[b] && 
      boardToCheck[a] === boardToCheck[c]
    ){
      return boardToCheck[a]
    }
  }
  // Si no hay ganador 
  return null
}

//Resetear juego
const resetGame = () => {
  //Volvemos el juego a como lo renderizamos primero
  setBoard(Array(9).fill(null))
  setTurn(TURNS.X)
  setWinner(null)

  window.localStorage.removeItem('board')
  window.localStorage.removeItem('turn')
}

//Chequeo de empate
const checkEndGame = (newBoard) => {

  //REvisa si es que no hay espacios vacios en el newBoard y nos devuelveun true

return newBoard.every((square) => square != null)

}

//UpdateBoard
const updateBoard = (index) => {

  //Si ya tenemos algo no actualiza nada
  if (board[index] || winner) return

  //Actualizacion del board
    //Creo una copia del board con [... board] con el spread operator
  const newBoard = [... board]
  newBoard[index] = turn
  setBoard(newBoard)

  //cambio de turno
  const newTurn = turn === TURNS.X ? TURNS.O : TURNS.X
  setTurn(newTurn)

  //Guardar partida
  window.localStorage.setItem('board', JSON.stringify(newBoard))
  window.localStorage.setItem('turn', newTurn)

  //revisar si hay un ganador
  const newWinner = checkWinner(newBoard)
   if(newWinner){
    confetti()
    setWinner(newWinner)
   } else if (checkEndGame(newBoard)) {
    setWinner(false) //Empate
   }

}


  return (
    <main className="board">
      <button onClick={resetGame}>Reset Game</button>
       <section className="game">
          {
            board.map((square, index) => {
              return (
                <Square key={index} index={index} updateBoard={updateBoard}> 
                {board[index]}
                </Square>
              )
            })
          }
       </section>

       <section className="turn">
          <Square isSelected={turn === TURNS.X}>{TURNS.X}</Square>
          <Square isSelected={turn === TURNS.O}>{TURNS.O}</Square>
       </section>

       <section>
        {
          winner != null && (
            <section className='winner'>
              <div className='text'>
                <h2>
                    {
                      winner === false ? 'Empate' : 'Ganó: '
                    }
                </h2>

                <header className='win'>
                    {winner && <Square>{winner}</Square>}
                </header>
                
                <footer>
                  <button onClick={resetGame}>Empezar de nuevo</button>
                </footer>

              </div>
            </section>
          )
        }
       </section>
    </main>
  )
}

export default App
