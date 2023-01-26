import {Component} from 'react'
import {BsSearch} from 'react-icons/bs'
import {BiChevronRightSquare} from 'react-icons/bi'
import Loader from 'react-loader-spinner'
import {Link} from 'react-router-dom'
import {FcGenericSortingAsc, FcGenericSortingDesc} from 'react-icons/fc'
import Header from '../Header'
import Footer from '../Footer'

import './index.css'

const statusVariable = {
  initial: 'IN',
  success: 'SU',
  failure: 'FA',
  loading: 'LO',
}

const statesList = [
  {
    state_code: 'AN',
    state_name: 'Andaman and Nicobar Islands',
  },
  {
    state_code: 'AP',
    state_name: 'Andhra Pradesh',
  },
  {
    state_code: 'AR',
    state_name: 'Arunachal Pradesh',
  },
  {
    state_code: 'AS',
    state_name: 'Assam',
  },
  {
    state_code: 'BR',
    state_name: 'Bihar',
  },
  {
    state_code: 'CH',
    state_name: 'Chandigarh',
  },
  {
    state_code: 'CT',
    state_name: 'Chhattisgarh',
  },
  {
    state_code: 'DN',
    state_name: 'Dadra and Nagar Haveli and Daman and Diu',
  },
  {
    state_code: 'DL',
    state_name: 'Delhi',
  },
  {
    state_code: 'GA',
    state_name: 'Goa',
  },
  {
    state_code: 'GJ',
    state_name: 'Gujarat',
  },
  {
    state_code: 'HR',
    state_name: 'Haryana',
  },
  {
    state_code: 'HP',
    state_name: 'Himachal Pradesh',
  },
  {
    state_code: 'JK',
    state_name: 'Jammu and Kashmir',
  },
  {
    state_code: 'JH',
    state_name: 'Jharkhand',
  },
  {
    state_code: 'KA',
    state_name: 'Karnataka',
  },
  {
    state_code: 'KL',
    state_name: 'Kerala',
  },
  {
    state_code: 'LA',
    state_name: 'Ladakh',
  },
  {
    state_code: 'LD',
    state_name: 'Lakshadweep',
  },
  {
    state_code: 'MH',
    state_name: 'Maharashtra',
  },
  {
    state_code: 'MP',
    state_name: 'Madhya Pradesh',
  },
  {
    state_code: 'MN',
    state_name: 'Manipur',
  },
  {
    state_code: 'ML',
    state_name: 'Meghalaya',
  },
  {
    state_code: 'MZ',
    state_name: 'Mizoram',
  },
  {
    state_code: 'NL',
    state_name: 'Nagaland',
  },
  {
    state_code: 'OR',
    state_name: 'Odisha',
  },
  {
    state_code: 'PY',
    state_name: 'Puducherry',
  },
  {
    state_code: 'PB',
    state_name: 'Punjab',
  },
  {
    state_code: 'RJ',
    state_name: 'Rajasthan',
  },
  {
    state_code: 'SK',
    state_name: 'Sikkim',
  },
  {
    state_code: 'TN',
    state_name: 'Tamil Nadu',
  },
  {
    state_code: 'TG',
    state_name: 'Telangana',
  },
  {
    state_code: 'TR',
    state_name: 'Tripura',
  },
  {
    state_code: 'UP',
    state_name: 'Uttar Pradesh',
  },
  {
    state_code: 'UT',
    state_name: 'Uttarakhand',
  },
  {
    state_code: 'WB',
    state_name: 'West Bengal',
  },
]

function convertObjectsDataIntoListItemsUsingForInMethod(data) {
  const resultList = []
  const stateListCodes = Object.values(statesList)
    .map(each => each.state_code)
    .sort()
  const keyNames = Object.keys(data)

  keyNames.forEach(keyName => {
    if (data[keyName] && stateListCodes.includes(keyName)) {
      const {total} = data[keyName]

      const confirmed = total.confirmed ? total.confirmed : 0
      const deceased = total.deceased ? total.deceased : 0
      const recovered = total.recovered ? total.recovered : 0
      const tested = total.tested ? total.tested : 0
      const population = data[keyName].meta.population
        ? data[keyName].meta.population
        : 0
      resultList.push({
        stateCode: keyName,
        name: statesList.find(state => state.state_code === keyName).state_name,
        confirmed,
        deceased,
        recovered,
        tested,
        population,
        active: confirmed - (deceased + recovered),
      })
    }
  })
  return resultList
}

class Home extends Component {
  state = {searchInput: '', apiStatus: statusVariable.initial, statesData: []}

  componentDidMount() {
    this.getStatesDetails()
  }

  getStatesDetails = async () => {
    this.setState({apiStatus: statusVariable.loading})
    const apiUrl = 'https://apis.ccbp.in/covid19-state-wise-data'
    const options = {method: 'GET'}
    const response = await fetch(apiUrl, options)
    const fetchedData = await response.json()
    if (response.ok) {
      this.setState({
        statesData: convertObjectsDataIntoListItemsUsingForInMethod(
          fetchedData,
        ),
        apiStatus: statusVariable.success,
      })
    } else {
      this.setState({apiStatus: statusVariable.failure})
    }
  }

  onChangeSearchInput = e => {
    this.setState({searchInput: e.target.value})
  }

  //   TODO : ON SUCCESS

  renderTotalCasesSection = () => {
    const {statesData} = this.state

    let activeCases = 0
    let confirmedCases = 0
    let deceasedCases = 0
    let recoveredCases = 0

    statesData.forEach(each => {
      activeCases += each.active
    })
    statesData.forEach(each => {
      confirmedCases += each.confirmed
    })
    statesData.forEach(each => {
      deceasedCases += each.deceased
    })
    statesData.forEach(each => {
      recoveredCases += each.recovered
    })

    return (
      <ul className="total-cases-details">
        <li key="confirmed" testid="countryWideConfirmedCases">
          <p>Confirmed</p>
          <img
            src="https://res.cloudinary.com/dchd92xe9/image/upload/v1674386714/Corona%20Dashboard/Home/Home%20total%20cases/Groupconfirmed_jeyrga.svg"
            alt="country wide confirmed cases pic"
          />
          <p>{confirmedCases}</p>
        </li>
        <li key="active" testid="countryWideActiveCases">
          <p>Active</p>
          <img
            src="https://res.cloudinary.com/dchd92xe9/image/upload/v1674386820/Corona%20Dashboard/Home/Home%20total%20cases/protection_1active_uixcd9.svg"
            alt="country wide active cases pic"
          />
          <p>{activeCases}</p>
        </li>
        <li key="recovered" testid="countryWideRecoveredCases">
          <p>Recovered</p>
          <img
            src="https://res.cloudinary.com/dchd92xe9/image/upload/v1674386899/Corona%20Dashboard/Home/Home%20total%20cases/Vectorrecovered_bdzgmb.svg"
            alt="country wide recovered cases pic"
          />
          <p>{recoveredCases}</p>
        </li>
        <li key="deceased" testid="countryWideDeceasedCases">
          <p>Deceased</p>
          <img
            src="https://res.cloudinary.com/dchd92xe9/image/upload/v1674386966/Corona%20Dashboard/Home/Home%20total%20cases/breathing_1deceased_yh2zk8.svg"
            alt="country wide deceased cases pic"
          />
          <p>{deceasedCases}</p>
        </li>
      </ul>
    )
  }

  renderSearchResultBasedOnInput = () => {
    const {statesData, searchInput} = this.state

    const condition = searchInput.length > 0
    const filteredStates = statesData.filter(each =>
      each.name.toLowerCase().startsWith(searchInput.toLowerCase()),
    )

    return (
      <>
        {condition && (
          <ul className="search-results" testid="searchResultsUnorderedList">
            {filteredStates.map(each => {
              const {name, stateCode} = each
              return (
                <Link
                  key={stateCode}
                  to={`/state/${stateCode}`}
                  className="link"
                >
                  <li>
                    <p>{name}</p>
                    <button type="button">
                      {stateCode}
                      <BiChevronRightSquare />
                    </button>
                  </li>
                </Link>
              )
            })}
          </ul>
        )}
      </>
    )
  }

  sortAsc = () => {
    const {statesData} = this.state
    const sortedOrder = statesData.sort((a, b) => {
      const nameA = a.name.toLowerCase()
      const nameB = b.name.toLowerCase()
      if (nameA > nameB) {
        return 1
      }
      if (nameA < nameB) {
        return -1
      }
      return 0
    })
    this.setState({statesData: sortedOrder})
  }

  sortDec = () => {
    const {statesData} = this.state
    const sortedOrder = statesData.sort((a, b) => {
      const nameA = a.name.toLowerCase()
      const nameB = b.name.toLowerCase()
      if (nameA > nameB) {
        return -1
      }
      if (nameA < nameB) {
        return 1
      }
      return 0
    })
    this.setState({statesData: sortedOrder})
  }

  renderListOfStates = () => {
    const {statesData} = this.state
    return (
      <ul className="states-list-details" testid="stateWiseCovidDataTable">
        <li key="box-head" className="box-head">
          <p id="states1">
            States/UT
            <button
              testid="ascendingSort"
              type="button"
              className="asc-dec"
              onClick={this.sortAsc}
            >
              <FcGenericSortingAsc />
            </button>
            <button
              testid="descendingSort"
              type="button"
              className="asc-dec"
              onClick={this.sortDec}
            >
              <FcGenericSortingDesc />
            </button>
          </p>
          <p>Confirmed</p>
          <p>Active</p>
          <p>Recovered</p>
          <p>Deceased</p>
          <p>Population</p>
        </li>

        {statesData.map(each => {
          const {
            stateCode,
            population,
            name,
            confirmed,
            deceased,
            recovered,
            active,
          } = each
          return (
            <li key={stateCode} className="other-states">
              <p id="states2">
                <Link to={`/state/${stateCode}`} className="link">
                  {name}
                </Link>
              </p>
              <p>{confirmed}</p>
              <p>{active}</p>
              <p>{recovered}</p>
              <p>{deceased}</p>
              <p>{population}</p>
            </li>
          )
        })}
      </ul>
    )
  }

  renderSuccess = () => (
    <div className="home-success">
      {this.renderTotalCasesSection()}
      {this.renderListOfStates()}
    </div>
  )

  //   TODO : Home Loader

  renderLoader = () => (
    <div className="home-loader" testid="homeRouteLoader">
      <Loader type="TailSpin" height="50" width="50" color="#007BFF" />
    </div>
  )

  homeResult = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case statusVariable.success:
        return this.renderSuccess()
      case statusVariable.loading:
        return this.renderLoader()
      default:
        return null
    }
  }

  render() {
    const {searchInput} = this.state

    return (
      <>
        <Header />
        <div className="body-bg home-body">
          {/* Search Box */}
          <div className="search-container">
            <BsSearch />
            <input
              type="text"
              placeholder="Enter the State"
              value={searchInput}
              onChange={this.onChangeSearchInput}
            />
          </div>
          {/* render search results based on input */}
          {this.renderSearchResultBasedOnInput()}
          {/* result totals container */}
          {this.homeResult()}
        </div>
        <Footer />
      </>
    )
  }
}
export default Home
