import { useState } from 'react'

const Button = (props) => (
  <button onClick={props.handleClick}>
    {props.text}
  </button>
)

const StatisticsLine = (props) => {
  return (
    <tr>
      <td>{props.text}</td>
      <td>{props.value} {props.symbol}</td>
    </tr>
  )
}

const Statistics = (props) => {
  if (props.valueAll === 0) {
    return (
      <p>No feedback given</p>
    )
  }
  return (
    <table>
      <tbody>
        <StatisticsLine text="good" value={props.valueG} />
        <StatisticsLine text="neutral" value={props.valueN} />
        <StatisticsLine text="bad" value={props.valueB} />
        <StatisticsLine text="all" value={props.valueAll} />
        <StatisticsLine text="average" value={props.valueAvg} />
        <StatisticsLine text="positive" value={props.valuePos} symbol="%" />
      </tbody>
    </table>
  )
}

const App = () => {
  // tallenna napit omaan tilaansa
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const setGoodValue = (newValue) => { setGood(newValue) }
  const setNeutralValue = (newValue) => { setNeutral(newValue) }
  const setBadValue = (newValue) => { setBad(newValue) }
  
  const countAll = () => { return good + neutral + bad }
  const countAvg = () => { return (good - bad) / countAll() }
  const countPos = () => { return (good / countAll()) * 100 }



  return (
    <div>
      <h1>give feedback</h1>
      <Button handleClick={() => setGoodValue(good + 1)} text="good" />
      <Button handleClick={() => setNeutralValue(neutral + 1)} text="neutral" />
      <Button handleClick={() => setBadValue(bad + 1)} text="bad" />
      <h1>statistics</h1>
      <Statistics valueG={good} valueN={neutral} valueB={bad} valueAll={countAll()} valueAvg={countAvg()} valuePos={countPos()} />
    </div>
  )
}

export default App