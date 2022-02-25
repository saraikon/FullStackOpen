import { useState } from 'react'

const Button = ({ handleClick, text }) => (
  <button onClick={handleClick}>
    {text}
  </button>
)


const Section = (props) => (
  <div>
    <h1>{props.header}</h1>
    <p>{props.anecdote}</p>
    <p>has {props.votes} votes</p>
  </div>
)
    

const App = () => {
  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when dianosing patients.'
  ]
   
  const [selected, setSelected] = useState(0)
  const [points, setPoints] = useState([0, 0, 0, 0, 0, 0, 0])


  const random = () => {
    return Math.floor(Math.random() * anecdotes.length);
  }

  const changeAnecdote = () => {
    setSelected(random())
  }

  const addVote = (selected) => {
    const copy = [...points]
    copy[selected] += 1
    setPoints(copy)
  }

  const mostVotes = () => {
    const largest = Math.max(...points)
    return points.indexOf(largest, 0)
  }

  return (
    <div>
      <Section header="Anecdote of the day" anecdote={anecdotes[selected]} votes={points[selected]} />
      <Button text="vote" handleClick={() => addVote(selected)}/>
      <Button text="next anecdote" handleClick={() => changeAnecdote()}/>
      <Section header="Anecdote with most votes" anecdote={anecdotes[mostVotes()]} votes={points[mostVotes()]} />
    </div>
  )
}

export default App