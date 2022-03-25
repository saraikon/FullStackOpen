import { useState, useEffect } from 'react'
import axios from 'axios'


const Filter = ({ showThese, handleFilterChange }) => {
  return (
    <form>
      <div>
        find countries <input value={showThese} onChange={handleFilterChange} />
      </div>
    </form>
  )
}

const Country = ({ name }) => {
  return(
    <p>{name}</p>
  )
}

const SingleCountry = ({ countries, filtered }) => {
  const indeksi = countries.map(country => country.name.common).indexOf(filtered[0])
  const maa = countries[indeksi]

  return (
    <div>
      <h1>{filtered[0]}</h1>
      <p>capital {maa.capital}</p>
      <p>area {maa.area}</p>
      <h2>languages:</h2>
      <ul>
        {Object.values(maa.languages).map(kieli => 
          <li key={kieli}>
            {kieli}
          </li>
        )}
      </ul>
      <img src={maa.flags.png} alt={filtered}></img>
    </div>
  )
}

const Countries = ({ countries, showThese }) => {
  
  const filtered =
    countries
      .map(country => country.name.common)
      .filter(name => name.toLowerCase()
      .includes(showThese.toLowerCase()))

  if (filtered.length > 10) {
    return (
      <p>Too many matches, specify another filter</p>
    )
  }

  if (filtered.length === 1 ) {
    return (
      <SingleCountry filtered={filtered} countries={countries} showThese={showThese} />
    )
  }

  return (
    filtered
      .map(country =>
        <Country key={country} name={country} />
    )
  )
}

const App = () => {
  const [countries, setCountries] = useState([])
  const [showThese, setShowThese] = useState('')

  useEffect(() => {
    axios
      .get('https://restcountries.com/v3.1/all')
      .then(response => {
        setCountries(response.data)
      })
  }, [])

  const handleFilterChange = (event) => {
    setShowThese(event.target.value)
  }

  return (
    <div>
      <Filter showThese={showThese} handleFilterChange={handleFilterChange} />
      <Countries countries={countries} showThese={showThese} />
    </div>
  )

}

export default App