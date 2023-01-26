import {Component} from 'react'
import Loader from 'react-loader-spinner'
import Slider from 'react-slick'

import Header from '../Header'
import Footer from '../Footer'
import './index.css'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'

const statusVariable = {
  initial: 'IN',
  success: 'SU',
  failure: 'FA',
  loading: 'LO',
}

class About extends Component {
  state = {apiStatus: statusVariable.initial, faqsData: {}}

  componentDidMount() {
    this.getQuestions()
  }

  getQuestions = async () => {
    this.setState({apiStatus: statusVariable.loading})
    const apiUrl = 'https://apis.ccbp.in/covid19-faqs'
    const response = await fetch(apiUrl)
    const fetchedData = await response.json()
    if (response.ok) {
      this.setState({apiStatus: statusVariable.success, faqsData: fetchedData})
    }
  }

  renderLoader = () => (
    <div className="home-loader" testid="aboutRouteLoader">
      <Loader type="TailSpin" height="50" width="50" color="#007BFF" />
    </div>
  )

  renderBanner = factoids => {
    const settings = {
      infinite: true,
      dots: false,
      slidesToShow: 1,
      slidesToScroll: 1,
      lazyLoad: true,
      fade: true,
      arrows: false,
      speed: 500,

      autoplay: true,
    }
    return (
      <div className="slick-container">
        <Slider {...settings}>
          {factoids.map(each => (
            <li key={each.id} className="banner">
              <p>{each.banner}</p>
            </li>
          ))}
        </Slider>
      </div>
    )
  }

  renderSuccess = () => {
    const {faqsData} = this.state
    const {faq, factoids} = faqsData
    return (
      <>
        {this.renderBanner(factoids)}
        <h1>About</h1>
        <p className="updated-date-text">Last update on march 28th 2021.</p>
        <p className="h-2">COVID-19 vaccines be ready for distribution</p>
        <ul className="faqs" testid="faqsUnorderedList">
          {faq.map(each => {
            const {answer, qno, question} = each

            return (
              <li key={qno}>
                <p className="que">
                  {qno}) {question}
                </p>
                <p className="ans">Ans. {answer}</p>
              </li>
            )
          })}
        </ul>
      </>
    )
  }

  renderAbout = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case statusVariable.loading:
        return this.renderLoader()
      case statusVariable.success:
        return this.renderSuccess()

      default:
        return null
    }
  }

  render() {
    return (
      <div className="body-bg">
        <Header />
        <div className="about-page">{this.renderAbout()}</div>
        <Footer />
      </div>
    )
  }
}
export default About
