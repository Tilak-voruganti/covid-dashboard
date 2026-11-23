/* eslint-disable react/no-unknown-property */
/* eslint-disable jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */
import {Component} from 'react'
import Loader from 'react-loader-spinner'
import {BarChart, Bar, XAxis, YAxis, Tooltip, LineChart, Line} from 'recharts'
import Header from '../Header'
import Footer from '../Footer'
import statesList from '../../statesList'
import './index.css'

const CATEGORY_CONFIG = {
  CONFIRMED: {
    key: 'confirmed',
    label: 'Confirmed',
    color: '#9A0E31',
    stroke: '#FF073A',
  },
  ACTIVE: {
    key: 'active',
    label: 'Active',
    color: '#0A4FA0',
    stroke: '#007BFF',
  },
  RECOVERED: {
    key: 'recovered',
    label: 'Recovered',
    color: '#216837',
    stroke: '#28A745',
  },
  DECEASED: {
    key: 'deceased',
    label: 'Deceased',
    color: '#474C57',
    stroke: '#6C757D',
  },
}

class StateSpecific extends Component {
  state = {
    isLoadingStateDetails: true,
    isLoadingTimelines: true,
    stateName: '',
    lastUpdated: '',
    testedCount: 0,
    confirmed: 0,
    active: 0,
    recovered: 0,
    deceased: 0,
    districtsList: [],
    timelineData: [],
    activeCategory: 'CONFIRMED',
  }

  componentDidMount() {
    this.getStateSpecificData()
    this.getTimelineData()
  }

  getStateSpecificData = async () => {
    const {match} = this.props
    const {stateCode} = match.params

    const matchedStateObj = statesList.find(
      each => each.state_code === stateCode,
    )
    const stateName = matchedStateObj ? matchedStateObj.state_name : stateCode

    const apiUrl = 'https://apis.ccbp.in/covid19-state-wise-data'
    const response = await fetch(apiUrl)
    if (response.ok) {
      const data = await response.json()
      const stateInfo = (data && data[stateCode]) || {}
      const totalObj = stateInfo.total || {}
      const metaObj = stateInfo.meta || {}
      const districtsObj = stateInfo.districts || {}

      const confirmedCount = totalObj.confirmed || 0
      const recoveredCount = totalObj.recovered || 0
      const deceasedCount = totalObj.deceased || 0
      const activeCount = confirmedCount - (recoveredCount + deceasedCount)
      const tested = totalObj.tested || 0

      const formattedDistricts = Object.keys(districtsObj).map(districtName => {
        const districtEntry = districtsObj[districtName] || {}
        const dTotal = districtEntry.total || {}
        const dConfirmed = dTotal.confirmed || 0
        const dRecovered = dTotal.recovered || 0
        const dDeceased = dTotal.deceased || 0
        const dActive = dConfirmed - (dRecovered + dDeceased)

        return {
          districtName,
          confirmed: dConfirmed,
          active: dActive,
          recovered: dRecovered,
          deceased: dDeceased,
        }
      })

      const sortedDistricts = [...formattedDistricts].sort(
        (a, b) => b.confirmed - a.confirmed,
      )

      this.setState({
        stateName,
        lastUpdated: metaObj.last_updated || '',
        testedCount: tested,
        confirmed: confirmedCount,
        active: activeCount,
        recovered: recoveredCount,
        deceased: deceasedCount,
        districtsList: sortedDistricts,
        isLoadingStateDetails: false,
      })
    } else {
      this.setState({isLoadingStateDetails: false})
    }
  }

  getTimelineData = async () => {
    const {match} = this.props
    const {stateCode} = match.params

    const apiUrl = `https://apis.ccbp.in/covid19-timelines-data/${stateCode}`
    const response = await fetch(apiUrl)
    if (response.ok) {
      const data = await response.json()
      const stateTimelineObj = (data && data[stateCode]) || {}
      const stateTimeline = stateTimelineObj.dates || {}

      const datesList = Object.keys(stateTimeline).sort()
      const formattedTimeline = datesList.map(dateKey => {
        const dayEntry = stateTimeline[dateKey] || {}
        const dayTotal = dayEntry.total || {}
        const dayConfirmed = dayTotal.confirmed || 0
        const dayRecovered = dayTotal.recovered || 0
        const dayDeceased = dayTotal.deceased || 0
        const dayActive = dayConfirmed - (dayRecovered + dayDeceased)
        const dayTested = dayTotal.tested || 0

        return {
          date: dateKey,
          confirmed: dayConfirmed,
          active: dayActive,
          recovered: dayRecovered,
          deceased: dayDeceased,
          tested: dayTested,
        }
      })

      this.setState({
        timelineData: formattedTimeline,
        isLoadingTimelines: false,
      })
    } else {
      this.setState({isLoadingTimelines: false})
    }
  }

  onSelectCategory = categoryKey => {
    this.setState(prevState => {
      const metricKey = CATEGORY_CONFIG[categoryKey].key
      const sorted = [...prevState.districtsList].sort(
        (a, b) => b[metricKey] - a[metricKey],
      )
      return {
        activeCategory: categoryKey,
        districtsList: sorted,
      }
    })
  }

  renderStateDetailsLoader = () => (
    <div testid="stateDetailsLoader" className="state-loader-container">
      <Loader type="TailSpin" color="#007BFF" height={50} width={50} />
    </div>
  )

  renderTimelinesLoader = () => (
    <div testid="timelinesDataLoader" className="state-loader-container">
      <Loader type="TailSpin" color="#007BFF" height={50} width={50} />
    </div>
  )

  renderStateCards = () => {
    const {confirmed, active, recovered, deceased, activeCategory} = this.state

    return (
      <div className="state-cards-grid">
        <div
          testid="stateSpecificConfirmedCasesContainer"
          onClick={() => this.onSelectCategory('CONFIRMED')}
          className={`state-stat-card confirmed-stat ${
            activeCategory === 'CONFIRMED' ? 'selected-confirmed' : ''
          }`}
        >
          <p className="state-card-title confirmed-text">Confirmed</p>
          <img
            src="https://res.cloudinary.com/dvmp5vgbm/image/upload/v1662435108/Covid19%20Dashboard/check-mark_1_y2f7b1.png"
            alt="state specific confirmed cases pic"
            className="state-card-icon"
          />
          <p className="state-card-count confirmed-text">{confirmed}</p>
        </div>

        <div
          testid="stateSpecificActiveCasesContainer"
          onClick={() => this.onSelectCategory('ACTIVE')}
          className={`state-stat-card active-stat ${
            activeCategory === 'ACTIVE' ? 'selected-active' : ''
          }`}
        >
          <p className="state-card-title active-text">Active</p>
          <img
            src="https://res.cloudinary.com/dvmp5vgbm/image/upload/v1662435108/Covid19%20Dashboard/protection_1_q8u2p4.png"
            alt="state specific active cases pic"
            className="state-card-icon"
          />
          <p className="state-card-count active-text">{active}</p>
        </div>

        <div
          testid="stateSpecificRecoveredCasesContainer"
          onClick={() => this.onSelectCategory('RECOVERED')}
          className={`state-stat-card recovered-stat ${
            activeCategory === 'RECOVERED' ? 'selected-recovered' : ''
          }`}
        >
          <p className="state-card-title recovered-text">Recovered</p>
          <img
            src="https://res.cloudinary.com/dvmp5vgbm/image/upload/v1662435108/Covid19%20Dashboard/recovered_1_p9k1m3.png"
            alt="state specific recovered cases pic"
            className="state-card-icon"
          />
          <p className="state-card-count recovered-text">{recovered}</p>
        </div>

        <div
          testid="stateSpecificDeceasedCasesContainer"
          onClick={() => this.onSelectCategory('DECEASED')}
          className={`state-stat-card deceased-stat ${
            activeCategory === 'DECEASED' ? 'selected-deceased' : ''
          }`}
        >
          <p className="state-card-title deceased-text">Deceased</p>
          <img
            src="https://res.cloudinary.com/dvmp5vgbm/image/upload/v1662435108/Covid19%20Dashboard/breathing_1_n4v8x2.png"
            alt="state specific deceased cases pic"
            className="state-card-icon"
          />
          <p className="state-card-count deceased-text">{deceased}</p>
        </div>
      </div>
    )
  }

  renderTopDistricts = () => {
    const {districtsList, activeCategory} = this.state
    const metricKey = CATEGORY_CONFIG[activeCategory].key

    return (
      <section className="top-districts-section">
        <h1 className="section-heading">Top Districts</h1>
        <ul testid="topDistrictsUnorderedList" className="districts-grid">
          {districtsList.map(eachDistrict => (
            <li key={eachDistrict.districtName} className="district-item">
              <span className="district-count">{eachDistrict[metricKey]}</span>
              <span className="district-name">{eachDistrict.districtName}</span>
            </li>
          ))}
        </ul>
      </section>
    )
  }

  renderChartsSection = () => {
    const {isLoadingTimelines, timelineData, activeCategory} = this.state

    if (isLoadingTimelines) {
      return this.renderTimelinesLoader()
    }

    const currentConfig = CATEGORY_CONFIG[activeCategory]
    const lastTenDaysData = Array.isArray(timelineData)
      ? timelineData.slice(-10)
      : []

    return (
      <section className="charts-section">
        <div className="bar-chart-box">
          <BarChart width={800} height={380} data={lastTenDaysData}>
            <XAxis dataKey="date" stroke={currentConfig.stroke} />
            <YAxis />
            <Tooltip />
            <Bar
              dataKey={currentConfig.key}
              fill={currentConfig.color}
              radius={[8, 8, 0, 0]}
            />
          </BarChart>
        </div>

        <h2 className="section-heading">Daily Spread Trends</h2>
        <div testid="lineChartsContainer" className="line-charts-container">
          <div className="line-chart-card confirmed-line-card">
            <h3 className="line-chart-label confirmed-text">Confirmed</h3>
            <LineChart width={800} height={240} data={timelineData}>
              <XAxis dataKey="date" stroke="#FF073A" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="confirmed"
                stroke="#FF073A"
                dot={false}
              />
            </LineChart>
          </div>

          <div className="line-chart-card active-line-card">
            <h3 className="line-chart-label active-text">Total Active</h3>
            <LineChart width={800} height={240} data={timelineData}>
              <XAxis dataKey="date" stroke="#007BFF" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="active"
                stroke="#007BFF"
                dot={false}
              />
            </LineChart>
          </div>

          <div className="line-chart-card recovered-line-card">
            <h3 className="line-chart-label recovered-text">Total Recovered</h3>
            <LineChart width={800} height={240} data={timelineData}>
              <XAxis dataKey="date" stroke="#28A745" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="recovered"
                stroke="#28A745"
                dot={false}
              />
            </LineChart>
          </div>

          <div className="line-chart-card deceased-line-card">
            <h3 className="line-chart-label deceased-text">Total Deceased</h3>
            <LineChart width={800} height={240} data={timelineData}>
              <XAxis dataKey="date" stroke="#6C757D" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="deceased"
                stroke="#6C757D"
                dot={false}
              />
            </LineChart>
          </div>

          <div className="line-chart-card tested-line-card">
            <h3 className="line-chart-label tested-text">Tested</h3>
            <LineChart width={800} height={240} data={timelineData}>
              <XAxis dataKey="date" stroke="#9673B9" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="tested"
                stroke="#9673B9"
                dot={false}
              />
            </LineChart>
          </div>
        </div>
      </section>
    )
  }

  renderStateDetails = () => {
    const {stateName, lastUpdated, testedCount} = this.state

    return (
      <div className="state-specific-content">
        <div className="state-top-banner">
          <div>
            <div className="state-name-pill">
              <h1 className="state-heading">{stateName}</h1>
            </div>
            <p className="last-updated-label">Last update on {lastUpdated}</p>
          </div>
          <div className="tested-box">
            <p className="tested-label">Tested</p>
            <p className="tested-value">{testedCount}</p>
          </div>
        </div>

        {this.renderStateCards()}
        {this.renderTopDistricts()}
        {this.renderChartsSection()}
      </div>
    )
  }

  render() {
    const {isLoadingStateDetails} = this.state

    return (
      <div className="state-specific-container">
        <Header />
        <main className="state-specific-main">
          {isLoadingStateDetails
            ? this.renderStateDetailsLoader()
            : this.renderStateDetails()}
        </main>
        <Footer />
      </div>
    )
  }
}

export default StateSpecific
