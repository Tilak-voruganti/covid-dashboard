/* eslint-disable react/no-unknown-property */
import {Component} from 'react'
import {Link} from 'react-router-dom'
import Loader from 'react-loader-spinner'
import {BsSearch} from 'react-icons/bs'
import {BiChevronRightSquare} from 'react-icons/bi'
import {FcGenericSortingAsc, FcGenericSortingDesc} from 'react-icons/fc'
import Header from '../Header'
import Footer from '../Footer'
import statesList from '../../statesList'
import './index.css'

class Home extends Component {
  state = {
    isLoading: true,
    statesData: [],
    searchInput: '',
    totalConfirmed: 0,
    totalActive: 0,
    totalRecovered: 0,
    totalDeceased: 0,
  }

  componentDidMount() {
    this.getCovidStateWiseData()
  }

  getCovidStateWiseData = async () => {
    const apiUrl = 'https://apis.ccbp.in/covid19-state-wise-data'
    const response = await fetch(apiUrl)
    if (response.ok) {
      const data = await response.json()

      let confirmedSum = 0
      let recoveredSum = 0
      let deceasedSum = 0
      let activeSum = 0

      const formattedStatesList = statesList.map(eachState => {
        const stateObj = data[eachState.state_code] || {}
        const totalObj = stateObj.total || {}
        const metaObj = stateObj.meta || {}

        const confirmed = totalObj.confirmed || 0
        const recovered = totalObj.recovered || 0
        const deceased = totalObj.deceased || 0
        const active = confirmed - (recovered + deceased)
        const population = metaObj.population || 0

        confirmedSum += confirmed
        recoveredSum += recovered
        deceasedSum += deceased
        activeSum += active

        return {
          stateCode: eachState.state_code,
          stateName: eachState.state_name,
          confirmed,
          active,
          recovered,
          deceased,
          population,
        }
      })

      this.setState({
        statesData: formattedStatesList,
        totalConfirmed: confirmedSum,
        totalActive: activeSum,
        totalRecovered: recoveredSum,
        totalDeceased: deceasedSum,
        isLoading: false,
      })
    } else {
      this.setState({isLoading: false})
    }
  }

  onChangeSearchInput = event => {
    this.setState({searchInput: event.target.value})
  }

  onSortAscending = () => {
    this.setState(prevState => {
      const sorted = [...prevState.statesData].sort((a, b) =>
        a.stateName.localeCompare(b.stateName),
      )
      return {statesData: sorted}
    })
  }

  onSortDescending = () => {
    this.setState(prevState => {
      const sorted = [...prevState.statesData].sort((a, b) =>
        b.stateName.localeCompare(a.stateName),
      )
      return {statesData: sorted}
    })
  }

  renderLoader = () => (
    <div testid="homeRouteLoader" className="home-loader-container">
      <Loader type="TailSpin" color="#007BFF" height={50} width={50} />
    </div>
  )

  renderSearchResults = () => {
    const {searchInput} = this.state
    const trimmedInput = searchInput.trim().toLowerCase()

    if (trimmedInput === '') {
      return null
    }

    const matchedStates = statesList.filter(eachState =>
      eachState.state_name.toLowerCase().includes(trimmedInput),
    )

    return (
      <ul testid="searchResultsUnorderedList" className="search-results-list">
        {matchedStates.map(eachState => (
          <Link
            to={`/state/${eachState.state_code}`}
            key={eachState.state_code}
            className="search-result-link"
          >
            <li className="search-result-item">
              <span className="search-state-name">{eachState.state_name}</span>
              <div className="search-code-badge">
                <span className="search-state-code">
                  {eachState.state_code}
                </span>
                <BiChevronRightSquare className="chevron-icon" />
              </div>
            </li>
          </Link>
        ))}
      </ul>
    )
  }

  renderCountryWideCards = () => {
    const {
      totalConfirmed,
      totalActive,
      totalRecovered,
      totalDeceased,
    } = this.state

    return (
      <div className="country-stats-grid">
        <div
          testid="countryWideConfirmedCases"
          className="stat-card confirmed-card"
        >
          <p className="stat-label confirmed-text">Confirmed</p>
          <img
            src="https://res.cloudinary.com/dvmp5vgbm/image/upload/v1662435108/Covid19%20Dashboard/check-mark_1_y2f7b1.png"
            alt="country wide confirmed cases pic"
            className="stat-icon"
          />
          <p className="stat-count confirmed-text">{totalConfirmed}</p>
        </div>

        <div testid="countryWideActiveCases" className="stat-card active-card">
          <p className="stat-label active-text">Active</p>
          <img
            src="https://res.cloudinary.com/dvmp5vgbm/image/upload/v1662435108/Covid19%20Dashboard/protection_1_q8u2p4.png"
            alt="country wide active cases pic"
            className="stat-icon"
          />
          <p className="stat-count active-text">{totalActive}</p>
        </div>

        <div
          testid="countryWideRecoveredCases"
          className="stat-card recovered-card"
        >
          <p className="stat-label recovered-text">Recovered</p>
          <img
            src="https://res.cloudinary.com/dvmp5vgbm/image/upload/v1662435108/Covid19%20Dashboard/recovered_1_p9k1m3.png"
            alt="country wide recovered cases pic"
            className="stat-icon"
          />
          <p className="stat-count recovered-text">{totalRecovered}</p>
        </div>

        <div
          testid="countryWideDeceasedCases"
          className="stat-card deceased-card"
        >
          <p className="stat-label deceased-text">Deceased</p>
          <img
            src="https://res.cloudinary.com/dvmp5vgbm/image/upload/v1662435108/Covid19%20Dashboard/breathing_1_n4v8x2.png"
            alt="country wide deceased cases pic"
            className="stat-icon"
          />
          <p className="stat-count deceased-text">{totalDeceased}</p>
        </div>
      </div>
    )
  }

  renderStateWiseTable = () => {
    const {statesData} = this.state

    return (
      <div testid="stateWiseCovidDataTable" className="state-table-wrapper">
        <div className="state-table-scroll">
          <div className="state-table-header">
            <div className="state-header-content">
              <p className="state-col-title">States/UT</p>
              <button
                type="button"
                testid="ascendingSort"
                onClick={this.onSortAscending}
                className="sort-btn"
                aria-label="Sort Ascending"
              >
                <FcGenericSortingAsc className="sort-icon" />
              </button>
              <button
                type="button"
                testid="descendingSort"
                onClick={this.onSortDescending}
                className="sort-btn"
                aria-label="Sort Descending"
              >
                <FcGenericSortingDesc className="sort-icon" />
              </button>
            </div>
            <p className="table-header-cell">Confirmed</p>
            <p className="table-header-cell">Active</p>
            <p className="table-header-cell">Recovered</p>
            <p className="table-header-cell">Deceased</p>
            <p className="table-header-cell">Population</p>
          </div>

          <ul className="state-rows-list">
            {statesData.map(eachState => (
              <li key={eachState.stateCode} className="table-body-row">
                <div className="table-body-cell state-name-cell">
                  <Link
                    to={`/state/${eachState.stateCode}`}
                    className="table-state-link"
                  >
                    {eachState.stateName}
                  </Link>
                </div>
                <p className="table-body-cell confirmed-cell">
                  {eachState.confirmed}
                </p>
                <p className="table-body-cell active-cell">
                  {eachState.active}
                </p>
                <p className="table-body-cell recovered-cell">
                  {eachState.recovered}
                </p>
                <p className="table-body-cell deceased-cell">
                  {eachState.deceased}
                </p>
                <p className="table-body-cell population-cell">
                  {eachState.population}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    )
  }

  render() {
    const {isLoading, searchInput} = this.state

    return (
      <div className="home-container">
        <Header />
        <main className="home-main">
          {isLoading ? (
            this.renderLoader()
          ) : (
            <div className="home-content">
              <div className="search-section">
                <div className="search-input-box">
                  <BsSearch className="search-icon" />
                  <input
                    type="search"
                    value={searchInput}
                    onChange={this.onChangeSearchInput}
                    placeholder="Enter the State"
                    className="search-input"
                  />
                </div>
                {this.renderSearchResults()}
              </div>

              {this.renderCountryWideCards()}
              {this.renderStateWiseTable()}
            </div>
          )}
        </main>
        <Footer />
      </div>
    )
  }
}

export default Home
