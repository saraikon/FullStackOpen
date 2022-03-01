import { useState } from 'react'

const Person = ({ name, number }) => {
  return (
    <p>{name} {number}</p>
  )
}

const Persons = ({ persons, showThese}) => {
  return (
    persons
      .filter(person =>
        person.name.toLowerCase().includes(showThese.toLowerCase()))
      .map(person => 
        <Person key={person.name} name={person.name} number={person.number} />
    )
  )
}

const Filter = ({ showThese, handleFilterChange }) => {
  return (
    <form>
      <div>
        filter shown with <input value={showThese} onChange={handleFilterChange} />
      </div>
    </form>
  )
}

const PersonForm = ({ addName, newName, handleNameChange, newNumber, handleNumberChange }) => {
  return (
    <form onSubmit={addName}>
      <div>
        name: <input value={newName} onChange={handleNameChange} />
      </div>
      <div>
        number: <input value={newNumber} onChange={handleNumberChange}/>
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  )
}


const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-123456' },
    { name: 'Ada Lovelace', number: '39-44-5323523' },
    { name: 'Dan Abramov', number: '12-43-234345' },
    { name: 'Mary Poppendieck', number: '39-23-6423122' }
  ])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [showThese, setShowThese] = useState('')

  const addName = (event) => {
    event.preventDefault()
    if (exists !== -1) {
      window.alert(`${newName} is already added to phonebook`)
      return
    }
    const personObject = {
      name: newName,
      number: newNumber
    }
  
    setPersons(persons.concat(personObject))
    setNewName('')
    setNewNumber('')
  }

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleFilterChange = (event) => {
    setShowThese(event.target.value)
  }

  const exists = persons.map(persons => persons.name.toLowerCase()).indexOf(newName.toLowerCase())

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter showThese={showThese} handleFilterChange={handleFilterChange} />
      <h2>add a new</h2>
      <PersonForm addName={addName} newName={newName} handleNameChange={handleNameChange} newNumber={newNumber} handleNumberChange={handleNumberChange} />
      <h2>Numbers</h2>
      <Persons showThese={showThese} persons={persons} />
      
    </div>
  )

}

export default App