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

const Country = ({ name, countries, onSelect }) => {
  return (
    <p>{name}
      <button onClick={onSelect}>
        show
      </button>
    </p>
  )
}

const SingleCountry = ({ maa }) => {

  const [weather, setWeather] = useState()

  useEffect(() => {
    const [lat, lng] = maa.capitalInfo.latlng
    const api_key = process.env.REACT_APP_API_KEY
    axios
      .get('https://api.openweathermap.org/data/2.5/weather?lat=' + lat + '&lon=' + lng + '&appid=' + api_key + '&units=metric')
      .then(response => {
        setWeather(response.data)
      })
  }, [maa])

  if (!weather) return null

  const imgurl = 'http://openweathermap.org/img/wn/' + weather.weather[0].icon + '@2x.png'

  return (
    <div>
      <h1>{maa.name.common}</h1>
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
      <img src={maa.flags.png} alt={maa.name.common}></img>
      <h2>Weather in {maa.capital}</h2>
      <p>temperature {weather.main.temp} Celsius</p>
      <img src={imgurl} alt='saa'></img>
      <p>wind {weather.wind.speed} m/s</p>
    </div>
  )
}

const Countries = ({ countries, showThese, onSelect }) => {

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

  if (filtered.length === 1) {
    const indeksi = countries.map(country => country.name.common).indexOf(filtered[0])
    const maa = countries[indeksi]
    return (
      <SingleCountry maa={maa} />
    )
  }

  return (
    filtered
      .map(country =>
        <Country key={country} name={country} countries={countries} onSelect={() => onSelect(country)} />
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
      <Countries countries={countries} showThese={showThese} onSelect={setShowThese} />
    </div>
  )

}

export default App