import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {AiFillStar} from 'react-icons/ai'
import {MdLocationOn} from 'react-icons/md'
import {BsFillBriefcaseFill, BsBoxArrowUpRight} from 'react-icons/bs'
import SimilarJobsCard from '../SimilarJobsCard'
import Header from '../Header'

import './index.css'

const apistatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class JobItemDetails extends Component {
  state = {
    jobItemData: {},

    apiStatus: apistatusConstants.initial,
  }

  componentDidMount() {
    this.getItemData()
  }

  getFormattedJobDetails = data => ({
    companyLogoUrl: data.company_logo_url,
    companyWebsiteUrl: data.company_website_url,
    employmentType: data.employment_type,
    id: data.id,
    jobDescription: data.job_description,
    lifeAtCompany: {
      description: data.life_at_company.description,
      imageUrl: data.life_at_company.image_url,
    },
    location: data.location,
    packagePerAnnum: data.package_per_annum,
    rating: data.rating,
    skills: data.skills.map(each => ({
      imageUrl: each.image_url,
      name: each.name,
    })),
    title: data.title,
  })

  getFormattedsimilarJobs = data =>
    data.map(each => ({
      companyLogoUrl: each.company_logo_url,
      employmentType: each.employment_type,
      id: each.id,
      jobDescription: each.job_description,
      location: each.location,
      rating: each.rating,
      title: each.title,
    }))

  getItemData = async () => {
    this.setState({apiStatus: apistatusConstants.inProgress})
    const jwtToken = Cookies.get('jwt_token')
    const {match} = this.props

    const {params} = match
    const {id} = params
    const url = `https://apis.ccbp.in/jobs/${id}`
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(url, options)
    const data = await response.json()

    if (response.ok === true) {
      const updatedData = {
        JobDetails: this.getFormattedJobDetails(data.job_details),
        similarJobs: this.getFormattedsimilarJobs(data.similar_jobs),
      }

      this.setState({
        jobItemData: updatedData,
        apiStatus: apistatusConstants.success,
      })
    } else {
      this.setState({apiStatus: apistatusConstants.failure})
    }
  }

  getSimilarjobDetails = async id => {
    this.setState({apiStatus: apistatusConstants.inProgress})
    const jwtToken = Cookies.get('jwt_token')
    const url = `https://apis.ccbp.in/jobs/${id}`
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(url, options)
    const data = await response.json()

    if (response.ok === true) {
      const updatedData = {
        JobDetails: this.getFormattedJobDetails(data.job_details),
        similarJobs: this.getFormattedsimilarJobs(data.similar_jobs),
      }

      this.setState({
        jobItemData: updatedData,
        apiStatus: apistatusConstants.success,
      })
    } else {
      this.setState({apiStatus: apistatusConstants.failure})
    }
  }

  renderitemDetailsSuccessView = () => {
    const {jobItemData} = this.state

    const {JobDetails, similarJobs} = jobItemData

    if (Object.keys(jobItemData).length >= 1) {
      const {
        companyLogoUrl,
        companyWebsiteUrl,
        employmentType,
        jobDescription,
        lifeAtCompany,
        location,
        packagePerAnnum,
        rating,
        skills,
        title,
      } = JobDetails

      const {description, imageUrl} = lifeAtCompany

      return (
        <div className="job-item-view-width-container">
          <div className="job-item-card-container">
            <div className="item-card-width-container">
              <div className="logo-container">
                <img
                  src={companyLogoUrl}
                  alt="job details company logo"
                  className="job-item-logo"
                />
                <div>
                  <h1 className="job-title">{title}</h1>
                  <div className="rating-container">
                    <AiFillStar className="rating-icon" />
                    <p className="rating">{rating}</p>
                  </div>
                </div>
              </div>
              <div className="location-jobtype-lpa-container">
                <div className="location-jobtype-container">
                  <div className="location-container">
                    <MdLocationOn className="location-icon" />
                    <p className="location">{location}</p>
                  </div>
                  <div className="location-container">
                    <BsFillBriefcaseFill className="location-icon" />
                    <p className="location">{employmentType}</p>
                  </div>
                </div>
                <p className="package">{packagePerAnnum}</p>
              </div>
              <div className="description-text-and-web-link-container">
                <h1 className="description-text">Description</h1>
                <a href={companyWebsiteUrl} className="visit-link">
                  <span>Visit</span>{' '}
                  <BsBoxArrowUpRight className="arrow-icon" />
                </a>
              </div>
              <p className="description">{jobDescription}</p>
              <h1 className="description-text">Skills</h1>
              <ul className="skills-list-container">
                {skills.map(each => (
                  <li className="skill-item-container" key={each.name}>
                    <img
                      src={each.imageUrl}
                      className="skill-img"
                      alt={each.name}
                    />
                    <p className="skill-name">{each.name}</p>
                  </li>
                ))}
              </ul>
              <h1 className="description-text">Life at Company</h1>
              <div className="life-at-company-container">
                <p className="description">{description}</p>
                <img
                  src={imageUrl}
                  alt=" life at company"
                  className="company-img"
                />
              </div>
            </div>
          </div>
          <h1 className="similar-jobs-heading">Similar Jobs</h1>
          <ul className="similar-jobs-list">
            {similarJobs.map(each => (
              <SimilarJobsCard
                similarJobDetails={each}
                key={each.id}
                getSimilarjobDetails={this.getSimilarjobDetails}
              />
            ))}
          </ul>
        </div>
      )
    }
    return null
  }

  onClickjobsfailureRetryBtn = () => {
    this.getItemData()
  }

  renderitemDetailsFailureView = () => (
    <div className="failure-view-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
        className="failure-view-img"
      />
      <h1 className="failure-view-heading">Oops! Something Went Wrong</h1>
      <p className="failure-view-description">
        We cannot seem to find the page you are looking for
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

  renderitemDetailsLoaderView = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height={50} width={50} />
    </div>
  )

  renderitemDetailsView = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apistatusConstants.inProgress:
        return this.renderitemDetailsLoaderView()
      case apistatusConstants.success:
        return this.renderitemDetailsSuccessView()
      case apistatusConstants.failure:
        return this.renderitemDetailsFailureView()
      default:
        return null
    }
  }

  render() {
    return (
      <>
        <Header />
        <div className="job-item-view-container">
          {this.renderitemDetailsView()}
        </div>
      </>
    )
  }
}
export default JobItemDetails
