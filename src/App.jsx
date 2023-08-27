import { useCallback, useState, useEffect } from 'react'
import './App.css'
import { wordsList } from './data/words'
import StartScreen from './Components/StartScreen'
import Game from './Components/Game'
import GameOver from './Components/GameOver'

const stages = [
  { id: 1, name: 'start' },
  { id: 2, name: 'game' },
  { id: 3, name: 'end' }
]


function App() {
  const [gameStage, setGameStage] = useState(stages[0].name)
  const [words] = useState(wordsList)

  const [pickedWord, setPickedWord] = useState("")
  const [pickedCategory, setpickedCategory] = useState("")
  const [letters, setLetters] = useState([])
  const [guessedLetters, setGuessedLetters] = useState([])
  const [wrongLetters, setWrongLetters] = useState([])
  const [guesses, setGuesses] = useState(3)
  const [score, setScore] = useState(0)
  const pickWordAndCategory = useCallback(() => {
    const categories = Object.keys(words)
    const category = categories[Math.floor(Math.random() * Object.keys(categories).length)]
    const word = words[category][Math.floor(Math.random() * words[category].length)]
    return { category, word }
  }, [words])

  const guessedQt = 3

  const startGame = useCallback(() => {
 clearLetterStates()
  console.log(letters)
    const { category, word } = pickWordAndCategory()
    let wordLetters = word.split("")
    wordLetters = wordLetters.map((l) => l.toLowerCase())
    setPickedWord(word)
    setpickedCategory(category)
    setLetters(wordLetters)
    console.log(`
      PALAVRA: ${word} - CATEGORIA: ${category} - LETRAS: ${letters}
    `)
    setGameStage(stages[1].name)
  }, [pickWordAndCategory])
  const verifyLetter = (letter) => {
    const normalizeLetter = letter.toLowerCase()
    if (guessedLetters.includes(normalizeLetter) || wrongLetters.includes(normalizeLetter)) {
      return
    }
    if (letters.includes(normalizeLetter)) {
      setGuessedLetters((actualGuessedLetters) => [
        ...actualGuessedLetters,
        normalizeLetter
      ])
    } else {
      setWrongLetters((actualWrongLetters) => [
        ...actualWrongLetters,
        normalizeLetter
      ])
      setGuesses((actualGuesses) => actualGuesses - 1)
    }
  }

  const clearLetterStates = () => {
    setGuessedLetters([])
    setWrongLetters([])
  }

  useEffect(() => {

    if (guesses <= 0) {
      clearLetterStates()
      setGameStage(stages[2].name)
    }
  }, [guesses])

  useEffect(()=>{

    const uniqueLetters = [... new Set(letters)]
    if(guessedLetters.length === uniqueLetters.length){
      setScore((actualScore)=> actualScore+=100)
       startGame()
    }

  }, [guessedLetters, letters, startGame])


  const retry = () => {
    setScore(0)
    setGuesses(guessedQt)
    setGameStage(stages[0].name)
  }

  return (
    <div className='app'>
      {gameStage === 'start' && <StartScreen startGame={startGame} />}
      {gameStage === 'game' && (
        <Game verifyLetter={verifyLetter}
          pickedWord={pickedWord}
          pickedCategory={pickedCategory}
          letters={letters}
          guessedLetters={guessedLetters}
          wrongLetters={wrongLetters}
          guesses={guesses}
          score={score}
        />
      )}
      {gameStage === 'end' && <GameOver retryGame={retry} score={score} />}
    </div>


  )
}

export default App
