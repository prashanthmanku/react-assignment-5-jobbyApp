import {Component} from 'react'
import {Link} from 'react-router-dom'
import {AiFillStar} from 'react-icons/ai'
import {MdLocationOn} from 'react-icons/md'
import {BsFillBriefcaseFill} from 'react-icons/bs'
import './index.css'

class JobItem extends Component {
  render() {
    const {jobDetails} = this.props
    const {
      companyLogoUrl,
      employmentType,
      id,
      jobDescription,
      location,
      packagePerAnnum,
      rating,
      title,
    } = jobDetails
    return (
      <li className="job-item-container">
        <Link to={`/jobs/${id}`} className="job-item-nav-link">
          <div className="job-item-width-container">
            <div className="logo-container">
              <img
                src={companyLogoUrl}
                alt="company logo"
                className="job-item-logo"
              />
              <div className="job-title-rating-container">
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
            <h1 className="description-text">Description</h1>
            <p className="description">{jobDescription}</p>
          </div>
        </Link>
      </li>
    )
  }
}
export default JobItem
