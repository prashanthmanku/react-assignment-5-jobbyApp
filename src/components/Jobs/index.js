// const apiUrl = 'https://apis.ccbp.in/jobs?employment_type=FULLTIME,PARTTIME&minimum_package=1000000&search='
import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {BsSearch} from 'react-icons/bs'
import JobItem from '../JobItem'
import Header from '../Header'

import './index.css'

const employmentTypesList = [
  {
    label: 'Full Time',
    employmentTypeId: 'FULLTIME',
  },
  {
    label: 'Part Time',
    employmentTypeId: 'PARTTIME',
  },
  {
    label: 'Freelance',
    employmentTypeId: 'FREELANCE',
  },
  {
    label: 'Internship',
    employmentTypeId: 'INTERNSHIP',
  },
]

const salaryRangesList = [
  {
    salaryRangeId: '1000000',
    label: '10 LPA and above',
  },
  {
    salaryRangeId: '2000000',
    label: '20 LPA and above',
  },
  {
    salaryRangeId: '3000000',
    label: '30 LPA and above',
  },
  {
    salaryRangeId: '4000000',
    label: '40 LPA and above',
  },
]
const apistatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class Jobs extends Component {
  state = {
    profileStaus: apistatusConstants.initial,
    jobsApiStatus: apistatusConstants.initial,
    profileData: '',
    jobsData: [],
    selectedEmploymentList: [],
    activeSalaryRange: '',
    searchInput: '',
  }

  componentDidMount() {
    this.getProfileData()
    this.getJobsData()
  }

  getProfileData = async () => {
    this.setState({profileStaus: apistatusConstants.inProgress})
    const jwtToken = Cookies.get('jwt_token')
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const url = 'https://apis.ccbp.in/profile'
    const response = await fetch(url, options)
    const profileData = await response.json()
    // console.log(response)
    // console.log(profileData)
    if (response.ok === true) {
      const data = profileData.profile_details

      const updatedProfileData = {
        name: data.name,
        profileImageUrl: data.profile_image_url,
        shortBio: data.short_bio,
      }
      console.log(updatedProfileData)
      this.setState({
        profileData: updatedProfileData,
        profileStaus: apistatusConstants.success,
      })
    } else {
      this.setState({profileStaus: apistatusConstants.failure})
    }
  }

  getJobsData = async () => {
    this.setState({jobsApiStatus: apistatusConstants.inProgress})
    const jwtToken = Cookies.get('jwt_token')
    const {searchInput, selectedEmploymentList, activeSalaryRange} = this.state
    const selectedemployments = selectedEmploymentList.join()
    const url = `https://apis.ccbp.in/jobs?employment_type=${selectedemployments}&minimum_package=${activeSalaryRange}&search=${searchInput}`
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(url, options)
    const data = await response.json()
    // console.log(response, data)
    if (response.ok === true) {
      const updatedData = data.jobs.map(each => ({
        companyLogoUrl: each.company_logo_url,
        employmentType: each.employment_type,
        id: each.id,
        jobDescription: each.job_description,
        location: each.location,
        packagePerAnnum: each.package_per_annum,
        rating: each.rating,
        title: each.title,
      }))
      console.log(updatedData)
      this.setState({
        jobsData: updatedData,
        jobsApiStatus: apistatusConstants.success,
      })
    } else {
      this.setState({jobsApiStatus: apistatusConstants.failure})
    }
  }

  onChangeSearchInput = e => {
    this.setState({searchInput: e.target.value})
  }

  onClickSearchIcon = () => {
    console.log('oop')
    this.getJobsData()
  }

  onClickRetryProfileBtn = () => {
    this.getProfileData()
  }

  onClickjobsfailureRetryBtn = () => {
    this.getJobsData()
  }

  ocChangeEmployment = e => {
    const {selectedEmploymentList} = this.state

    if (e.target.checked === true) {
      const newList = [...selectedEmploymentList, e.target.value]

      this.setState({selectedEmploymentList: newList}, this.getJobsData)
    } else {
      const index = selectedEmploymentList.indexOf(e.target.value)
      selectedEmploymentList.splice(index, 1)
      const newList = [...selectedEmploymentList]
      this.setState({selectedEmploymentList: newList}, this.getJobsData)
    }
  }

  onChangeSalaryRange = e => {
    this.setState({activeSalaryRange: e.target.value}, this.getJobsData)
  }

  renderProfileSuccessView = () => {
    const {profileData} = this.state
    const {name, profileImageUrl, shortBio} = profileData
    return (
      <div className="profile-container">
        <img src={profileImageUrl} alt="profile" className="profile-img" />
        <h1 className="user-name">{name}</h1>
        <p className="user-bio">{shortBio}</p>
      </div>
    )
  }

  renderLoader = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height={50} width={50} />
    </div>
  )

  renderProfileFailureView = () => (
    <button
      type="button"
      className="retry-btn"
      onClick={this.onClickRetryProfileBtn}
    >
      Retry
    </button>
  )

  renderProfileView = () => {
    const {profileStaus} = this.state
    switch (profileStaus) {
      case apistatusConstants.inProgress:
        return this.renderLoader()
      case apistatusConstants.success:
        return this.renderProfileSuccessView()
      case apistatusConstants.failure:
        return this.renderProfileFailureView()
      default:
        return null
    }
  }

  renderJobCards = () => {
    const {jobsData} = this.state
    return (
      <ul className="jobs-list-container">
        {jobsData.map(each => (
          <JobItem jobDetails={each} key={each.id} />
        ))}
      </ul>
    )
  }

  renderNoJobCards = () => (
    <div className="nojobs-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
        alt=" no jobs"
        className="no-jobs-img"
      />
      <h1 className="no-jobs-heading">No Jobs Found</h1>
      <p className="no-jobs-description">
        We could not find any jobs. Try other filters
      </p>
    </div>
  )

  renderJobsList = () => {
    const {jobsData} = this.state
    if (jobsData.length > 0) {
      return this.renderJobCards()
    }
    return this.renderNoJobCards()
  }

  rendeJobsFailureView = () => (
    <div className="failure-view-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
        className="failure-view-img"
      />
      <h1 className="failure-view-heading">Oops! Something Went Wrong</h1>
      <p className="failure-view-description">
        We cannot seem to find the page you are looking for.
      </p>
      <button
        type="button"
        className="jobs-failure-retry-btn"
        onClick={this.onClickjobsfailureRetryBtn}
      >
        Retry
      </button>
    </div>
  )

  renderJobsView = () => {
    const {jobsApiStatus} = this.state
    switch (jobsApiStatus) {
      case apistatusConstants.inProgress:
        return this.renderLoader()
      case apistatusConstants.success:
        return this.renderJobsList()
      case apistatusConstants.failure:
        return this.rendeJobsFailureView()
      default:
        return null
    }
  }

  render() {
    const {searchInput} = this.state
    return (
      <>
        <Header />
        <div className="jobs-route-bg-container">
          <div className="jobs-width-container">
            <div className="profile-queries-container">
              <div className="search-input-container mobile-search-bar">
                <input
                  type="search"
                  placeholder="Search"
                  className="input-field"
                  value={searchInput}
                  onChange={this.onChangeSearchInput}
                />
                <button
                  type="button"
                  className="search-icon-btn"
                  data-testid="searchButton"
                  onClick={this.onClickSearchIcon}
                >
                  <BsSearch className="search-icon" />
                </button>
              </div>
              <div className="profile-view">{this.renderProfileView()}</div>

              <div className="employment-types-container">
                <h1 className="employment-type-heading">Type of Employment</h1>
                <ul className="employment-list">
                  {employmentTypesList.map(each => (
                    <li key={each.employmentTypeId}>
                      <input
                        type="checkbox"
                        id={each.employmentTypeId}
                        className="emplaoyment-checkbox"
                        onChange={this.ocChangeEmployment}
                        value={each.employmentTypeId}
                      />
                      <label
                        htmlFor={each.employmentTypeId}
                        className="emplaoyment-label-text"
                      >
                        {each.label}
                      </label>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="salary-range-container">
                <h1 className="employment-type-heading">Salary Range</h1>
                <ul className="employment-list">
                  {salaryRangesList.map(each => (
                    <li key={each.salaryRangeId}>
                      <input
                        type="radio"
                        id={each.salaryRangeId}
                        value={each.salaryRangeId}
                        className="radio"
                        name="salary-range"
                        onChange={this.onChangeSalaryRange}
                      />
                      <label
                        className="emplaoyment-label-text"
                        htmlFor={each.salaryRangeId}
                      >
                        {each.label}
                      </label>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="job-cards">
              <div className="search-input-container desktop-search-bar">
                <input
                  type="search"
                  placeholder="Search"
                  className="input-field"
                  value={searchInput}
                  onChange={this.onChangeSearchInput}
                />
                <button
                  type="button"
                  className="search-icon-btn"
                  data-testid="searchButton"
                  onClick={this.onClickSearchIcon}
                >
                  <BsSearch className="search-icon" />
                </button>
              </div>

              <div className="jobs-view-container">{this.renderJobsView()}</div>
            </div>
          </div>
        </div>
      </>
    )
  }
}
export default Jobs
