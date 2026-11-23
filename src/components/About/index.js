/* eslint-disable react/no-unknown-property */
import {Component} from 'react'
import Loader from 'react-loader-spinner'
import Header from '../Header'
import Footer from '../Footer'
import './index.css'

class About extends Component {
  state = {
    faqsList: [],
    isLoading: true,
  }

  componentDidMount() {
    this.getFaqsData()
  }

  getFaqsData = async () => {
    const apiUrl = 'https://apis.ccbp.in/covid19-faqs'
    const response = await fetch(apiUrl)
    if (response.ok) {
      const data = await response.json()
      this.setState({
        faqsList: data.faq,
        isLoading: false,
      })
    } else {
      this.setState({isLoading: false})
    }
  }

  renderLoader = () => (
    <div testid="aboutRouteLoader" className="loader-container">
      <Loader type="TailSpin" color="#007BFF" height={50} width={50} />
    </div>
  )

  renderFaqsList = () => {
    const {faqsList} = this.state

    return (
      <div className="about-content">
        <h1 className="about-heading">About</h1>
        <p className="last-updated-text">Last update on march 28th 2021.</p>
        <p className="about-subtitle">
          COVID-19 vaccines be ready for distribution
        </p>
        <ul testid="faqsUnorderedList" className="faqs-list">
          {faqsList.map(eachFaq => (
            <li key={eachFaq.qno} className="faq-item">
              <p className="faq-question">{eachFaq.question}</p>
              <p className="faq-answer">{eachFaq.answer}</p>
            </li>
          ))}
        </ul>
      </div>
    )
  }

  render() {
    const {isLoading} = this.state

    return (
      <div className="about-page-container">
        <Header />
        <main className="about-main">
          {isLoading ? this.renderLoader() : this.renderFaqsList()}
        </main>
        <Footer />
      </div>
    )
  }
}

export default About
