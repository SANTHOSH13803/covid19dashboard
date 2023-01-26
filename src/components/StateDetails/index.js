import {Component} from 'react'
// import {format} from 'date-fns'
// import {v4} from 'uuid'
import {
  LineChart,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Line,
  LabelList,
  BarChart,
  Bar,
} from 'recharts'
import Loader from 'react-loader-spinner'
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

const activeIds = {
  confirmed: 'confirmed',
  active: 'active',
  recovered: 'recovered',
  deceased: 'deceased',
}

class StateDetails extends Component {
  state = {
    apiStatus: statusVariable.initial,
    stateData: {},
    stateModifiedData: {},
    activeOptionId: 'confirmed',
    barGraphData: [],
    chartStatus: statusVariable.initial,
  }

  componentDidMount() {
    this.getStateData()
    this.getBarChartsData()
  }

  getStateData = async () => {
    const {match} = this.props
    const {params} = match
    const {stateCode} = params
    this.setState({apiStatus: statusVariable.loading})
    const apiUrl = `https://apis.ccbp.in/covid19-state-wise-data`
    const response = await fetch(apiUrl)
    const fetchedData = await response.json()
    if (response.ok) {
      const statesArray = convertObjectsDataIntoListItemsUsingForInMethod(
        fetchedData,
      )
      const stateItem = statesArray.find(each => each.stateCode === stateCode)
      this.setState({
        apiStatus: statusVariable.success,
        stateData: fetchedData[stateCode],
        stateModifiedData: stateItem,
      })
    }
  }

  getBarChartsData = async () => {
    this.setState({chartStatus: statusVariable.loading})
    const {match} = this.props
    const {params} = match
    const {stateCode} = params
    const apiUrl = `https://apis.ccbp.in/covid19-timelines-data/${stateCode}`
    const response = await fetch(apiUrl)
    const fetchedData = await response.json()
    if (response.ok) {
      this.setState({
        barGraphData: fetchedData[stateCode].dates,
        chartStatus: statusVariable.success,
      })
    }
  }

  onClickConfirmed = () => {
    this.setState({activeOptionId: activeIds.confirmed}, this.getBarChartsData)
  }

  onClickActive = () => {
    this.setState({activeOptionId: activeIds.active}, this.getBarChartsData)
  }

  onClickRecovered = () => {
    this.setState({activeOptionId: activeIds.recovered}, this.getBarChartsData)
  }

  onClickDeceased = () => {
    this.setState({activeOptionId: activeIds.deceased}, this.getBarChartsData)
  }

  renderLoader = () => (
    <div className="home-loader">
      <Loader type="TailSpin" height="50" width="50" color="#007BFF" />
    </div>
  )

  renderChartLoader = () => (
    <div className="home-loader">
      <Loader type="TailSpin" height="50" width="50" color="#007BFF" />
    </div>
  )

  renderTotalCasesSection = () => {
    const {stateData, activeOptionId} = this.state
    const activeCases =
      stateData.total.confirmed -
      (stateData.total.recovered + stateData.total.deceased)
    return (
      <ul className="total-cases-details spec-state">
        <li
          key="confirmed"
          onClick={this.onClickConfirmed}
          className={activeOptionId === activeIds.confirmed ? 'confirmed' : ''}
        >
          <p>Confirmed</p>
          <img
            src="https://res.cloudinary.com/dchd92xe9/image/upload/v1674386714/Corona%20Dashboard/Home/Home%20total%20cases/Groupconfirmed_jeyrga.svg"
            alt="state specific confirmed cases pic"
          />
          <p>{stateData.total.confirmed}</p>
        </li>
        <li
          key="active"
          onClick={this.onClickActive}
          className={activeOptionId === activeIds.active ? 'active' : ''}
        >
          <p>Active</p>
          <img
            src="https://res.cloudinary.com/dchd92xe9/image/upload/v1674386820/Corona%20Dashboard/Home/Home%20total%20cases/protection_1active_uixcd9.svg"
            alt="state specific active cases pic"
          />
          <p>{activeCases}</p>
        </li>
        <li
          key="recovered"
          onClick={this.onClickRecovered}
          className={activeOptionId === activeIds.recovered ? 'recovered' : ''}
        >
          <p>Recovered</p>
          <img
            src="https://res.cloudinary.com/dchd92xe9/image/upload/v1674386899/Corona%20Dashboard/Home/Home%20total%20cases/Vectorrecovered_bdzgmb.svg"
            alt="state specific recovered cases pic"
          />
          <p>{stateData.total.recovered}</p>
        </li>
        <li
          key="deceased"
          onClick={this.onClickDeceased}
          className={activeOptionId === activeIds.deceased ? 'deceased' : ''}
        >
          <p>Deceased</p>
          <img
            src="https://res.cloudinary.com/dchd92xe9/image/upload/v1674386966/Corona%20Dashboard/Home/Home%20total%20cases/breathing_1deceased_yh2zk8.svg"
            alt="state specific deceased cases pic"
          />
          <p>{stateData.total.deceased}</p>
        </li>
      </ul>
    )
  }

  renderTopDistrictSection = () => {
    const {stateData, activeOptionId} = this.state
    let key = 'confirmed'
    let activeClass = 'confirmed-text'
    let districtsData
    switch (activeOptionId) {
      case activeIds.active:
        key = 'active'
        activeClass = 'active-text'
        break
      case activeIds.deceased:
        key = 'deceased'
        activeClass = 'deceased-text'
        break
      case activeIds.confirmed:
        key = 'confirmed'
        activeClass = 'confirmed-text'
        break
      case activeIds.recovered:
        key = 'recovered'
        activeClass = 'recovered-text'
        break
      default:
        break
    }
    const districts = Object.entries(stateData.districts)
    if (activeOptionId === activeIds.active) {
      districtsData = districts.map(each => ({
        districtName: each[0],
        districtCount:
          each[1].total.confirmed -
          (each[1].total.recovered + each[1].total.deceased),
      }))
    } else {
      districtsData = districts.map(each => ({
        districtName: each[0],
        districtCount: each[1].total[key],
      }))
    }

    districtsData = districtsData.map(each => {
      if (
        each.districtCount === undefined ||
        Object.is(each.districtCount, NaN)
      ) {
        return {...each, districtCount: 0}
      }
      return each
    })

    districtsData = districtsData.sort(
      (a, b) => b.districtCount - a.districtCount,
    )
    return (
      <div>
        <h1 className={activeClass}>Top Districts</h1>
        <ul className="top-dist">
          {districtsData.map(each => {
            const {districtName, districtCount} = each
            return (
              <li key={districtName}>
                <p>{districtCount}</p>
                <p>{districtName}</p>
              </li>
            )
          })}
        </ul>
      </div>
    )
  }

  renderBarGraph = () => {
    const {barGraphData, activeOptionId} = this.state
    let barData
    if (activeOptionId === activeIds.active) {
      barData = Object.entries(barGraphData).map(each => ({
        // date: format(new Date(each[0]), 'dd-MMM'),
        date: each[0],
        count:
          each[1].total.confirmed -
          each[1].total.recovered -
          each[1].total.deceased,
      }))
    } else {
      barData = Object.entries(barGraphData).map(each => ({
        // date: format(new Date(each[0]), 'dd-MMM'),
        date: each[0],
        count: each[1].total[activeOptionId],
      }))
    }

    let activeClass = '#ff073a'
    switch (activeOptionId) {
      case activeIds.active:
        activeClass = '#007bff'
        break
      case activeIds.deceased:
        activeClass = '#6c757d'
        break
      case activeIds.confirmed:
        activeClass = '#ff073a'
        break
      case activeIds.recovered:
        activeClass = '#28a745'
        break
      default:
        break
    }

    const sortedData = barData.reverse().slice(0, 10).reverse()

    const dataFormatter = number => {
      if (number > 100000) {
        return `${(number / 100000).toFixed(2).toString()}Lc`
      }
      if (number > 10000) {
        return `${(number / 10000).toFixed(2).toString()}k`
      }
      return number.toString()
    }

    const lengendText = {
      active: 'Active',
      deceased: 'Deceased',
      confirmed: 'Confirmed',
      recovered: 'Recovered',
      tested: 'Tested',
    }

    return (
      <div className="bar-graph-top">
        <BarChart
          width={1000}
          height={400}
          data={sortedData}
          margin={{
            top: 10,
          }}
          animationEasing="ease-in-out"
        >
          <XAxis
            dataKey="date"
            tick={{
              stroke: `${activeClass}`,
              fontSize: 16,
              strokeWidth: 1,
              fontFamily: 'Roboto',
            }}
            axisLine={{stroke: 'transparent'}}
            tickLine={{stroke: 'transparent'}}
          />
          <Legend
            wrapperStyle={{
              paddingTop: 20,
              fontSize: 20,
              fontFamily: 'Roboto',
            }}
            iconType="circle"
          />

          <Bar
            barSize={40}
            dataKey="count"
            radius={[10, 10, 0, 0]}
            fill={activeClass}
            name={lengendText[activeOptionId]}
            animationEasing="ease"
          >
            <LabelList
              formatter={dataFormatter}
              dataKey="count"
              position="top"
              fontSize="16"
              fill={`${activeClass}`}
            />
          </Bar>
        </BarChart>
      </div>
    )
  }

  renderSpreadSheets = () => {
    const {barGraphData} = this.state
    const spreadSheets = [
      'active',
      'confirmed',
      'recovered',
      'deceased',
      'tested',
    ]
    const spreadSheetsdata = spreadSheets.map(activeId => {
      if (activeId === activeIds.active) {
        return [
          activeId,
          Object.entries(barGraphData)
            .map(each => ({
              //   date: format(new Date(each[0]), 'dd-MMM'),
              date: each[0],
              count:
                each[1].total.confirmed -
                each[1].total.recovered -
                each[1].total.deceased,
            }))
            .slice(0, 10),
        ]
      }

      const barData = Object.entries(barGraphData)
        .map(each => ({
          //   date: format(new Date(each[0]), 'dd-MMM'),
          date: each[0],
          count: each[1].total[activeId],
        }))
        .slice(0, 10)
      return [activeId, barData]
    })

    const linesColor = {
      active: '#007bff',
      deceased: '#6c757d',
      confirmed: '#ff073a',
      recovered: '#28a745',
      tested: '#9673B9',
    }

    const lengendText = {
      active: 'Active',
      deceased: 'Deceased',
      confirmed: 'Confirmed',
      recovered: 'Recovered',
      tested: 'Tested',
    }

    const dataFormatter = number => {
      if (number > 1000) {
        return `${(number / 1000).toFixed(0).toString()}k`
      }
      return number.toString()
    }
    return (
      <div className="spread-sheets">
        <h1>Daily spread sheets</h1>
        <div>
          {spreadSheetsdata.map(eachSpreadSheet => (
            <div className="overflow-handler">
              <div className={`spread-${eachSpreadSheet[0]} spread-container`}>
                <LineChart
                  width={1000}
                  height={400}
                  data={eachSpreadSheet[1]}
                  margin={{top: 5, right: 30, left: 20, bottom: 5}}
                >
                  {/* <CartesianGrid strokeDasharray="3 3" /> */}
                  <XAxis
                    dataKey="date"
                    stroke={linesColor[eachSpreadSheet[0]]}
                  />
                  <YAxis
                    tickFormatter={dataFormatter}
                    stroke={linesColor[eachSpreadSheet[0]]}
                  />
                  <Tooltip />
                  <Legend
                    align="center"
                    wrapperStyle={{fontSize: 20, paddingTop: 20}}
                  />
                  <Line
                    type="monotone"
                    dataKey="count"
                    name={lengendText[eachSpreadSheet[0]]}
                    stroke={linesColor[eachSpreadSheet[0]]}
                  />
                </LineChart>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  renderChartSuccess = () => (
    <>
      {this.renderBarGraph()}
      {this.renderSpreadSheets()}
    </>
  )

  renderGraphs = () => {
    const {chartStatus} = this.state
    switch (chartStatus) {
      case statusVariable.loading:
        return this.renderChartLoader()
      case statusVariable.success:
        return this.renderChartSuccess()

      default:
        return null
    }
  }

  renderSuccess = () => {
    const {stateData, stateModifiedData} = this.state

    const lastUpdated = new Date(stateData.meta.last_updated)
    const month = lastUpdated.toLocaleString('default', {month: 'long'})
    const year = lastUpdated.getFullYear()
    const stringDate = `${month} ${lastUpdated.getDate()} ${year}`

    return (
      <div className="details-success">
        <div className="details-heading">
          <div>
            <h1 className="state-name">{stateModifiedData.name}</h1>
            <p>Last update on {stringDate}.</p>
          </div>
          <div>
            <p className="tested-text">Tested</p>
            <p className="tested">{stateModifiedData.tested}</p>
          </div>
        </div>
        {this.renderTotalCasesSection()}
        {this.renderTopDistrictSection()}
        {this.renderGraphs()}
      </div>
    )
  }

  renderStateDetails = () => {
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
        <div className="state-details-box">{this.renderStateDetails()}</div>
        <Footer />
      </div>
    )
  }

  //   render() {
  //     return <h1>stateDetails page</h1>
  //   }
}

export default StateDetails
