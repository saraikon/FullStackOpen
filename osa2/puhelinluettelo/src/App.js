import { useState, useEffect } from 'react'
import personService from './services/persons'

const Person = ({ name, number, id, deleteName }) => {
  return (
    <p>
      {name} {number} <button onClick={() => deleteName(id, name)}>delete</button>
    </p>
  )
}

const Persons = ({ persons, showThese, deleteName }) => {
  return (
    persons
      .filter(person =>
        person.name.toLowerCase().includes(showThese.toLowerCase()))
      .map(person => 
        <Person key={person.name} name={person.name} id={person.id} number={person.number} deleteName={deleteName} />
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

const Notification = ({ message }) => {
  if (message === null) {
    return null
  }

  return (
    <div className="error">
      {message}
    </div>
  )
}


const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [showThese, setShowThese] = useState('')
  const [errorMessage, setErrorMessage] = useState(null)


  useEffect(() => {
    personService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
      })
  }, [])

  const addName = (event) => {
    event.preventDefault()

    if (exists !== -1) {
      if (!window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {
        return
      }
      const person = persons.find(n => n.name === newName)
      const changedPerson = { ...person, number: newNumber }

      personService
        .update(person.id, changedPerson)
        .then(returnedPerson => {
          setPersons(persons.map(p => p.id !== person.id ? p : returnedPerson))
          setNewName('')
          setNewNumber('')
        })
        .catch(error => {
          setErrorMessage(
            `Information of ${person.name} has already been removed from server`
          )
          setTimeout(() => {
            setErrorMessage(null)
          }, 5000)
          setPersons(persons.filter(p => p.id !== person.id))
        })

      setErrorMessage(`Updated the number of ${person.name}`)
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)

      return

    }
    
    const personObject = {
      name: newName,
      number: newNumber
    }

    personService
      .create(personObject)
      .then(newPerson => {
        setPersons(persons.concat(newPerson))
        setNewName('')
        setNewNumber('')
      })
      
    setErrorMessage(`Added ${personObject.name}`)
    setTimeout(() => {
      setErrorMessage(null)
    }, 5000)
  }

  const deleteName = (id, name) => {
    if (!window.confirm('Delete ' + name + '?')) {
      return
    }
    personService
      .remove(id)
      .then(
        setPersons(persons.filter(p => p.id !== id))
      )
      
    setErrorMessage(`Deleted ${name}`)
    setTimeout(() => {
      setErrorMessage(null)
    }, 5000)
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
      <Notification message={errorMessage} />
      <Filter showThese={showThese} handleFilterChange={handleFilterChange} />
      <h2>add a new</h2>
      <PersonForm addName={addName} newName={newName} handleNameChange={handleNameChange} newNumber={newNumber} handleNumberChange={handleNumberChange} />
      <h2>Numbers</h2>
      <Persons showThese={showThese} persons={persons} deleteName={deleteName} /> 
    </div>
  )

}

export default App