import {Link} from 'react-router-dom'

import {AiFillStar} from 'react-icons/ai'
import {MdLocationOn} from 'react-icons/md'
import {BsFillBriefcaseFill} from 'react-icons/bs'
import './index.css'

const SimilarJobsCard = props => {
  const {similarJobDetails, getSimilarjobDetails} = props
  const {
    companyLogoUrl,
    employmentType,
    id,
    jobDescription,
    location,
    rating,
    title,
  } = similarJobDetails

  const get = () => {
    getSimilarjobDetails(id)
  }

  return (
    <li className="similar-job-item-container">
      <Link to={`/jobs/${id}`} className="similar-nav-link" onClick={get}>
        <div className="similar-job-card-width-container">
          <div className="s-logo-container ">
            <img
              src={companyLogoUrl}
              alt=" similar job company logo"
              className="s-logo-img"
            />
            <div>
              <h1 className="s-title">{title}</h1>
              <div className="s-rating-container">
                <AiFillStar className="s-rating-icon" />
                <p className="s-rating">{rating}</p>
              </div>
            </div>
          </div>
          <h1 className="s-description-text">Description</h1>
          <p className="s-description">{jobDescription}</p>
          <div className="s-location-jobtype-container">
            <div className="s-location-container">
              <MdLocationOn className="s-location-icon" />
              <p className="s-location">{location}</p>
            </div>
            <div className="s-location-container">
              <BsFillBriefcaseFill className="s-location-icon" />
              <p className="s-location">{employmentType}</p>
            </div>
          </div>
        </div>
      </Link>
    </li>
  )
}
export default SimilarJobsCard
