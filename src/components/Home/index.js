import {Link} from 'react-router-dom'
import Header from '../Header'
import './index.css'

const Home = () => (
  <>
    <Header />
    <div className="home-bg-container">
      <div className="home-width-container">
        <div className="home-content">
          <h1 className="home-heading">Find The Job That Fits Your Life</h1>
          <p className="home-description">
            Millions of people are searching for jobs, salary information,
            company reviews. Find the job that fits Your abilities and
            potential.
          </p>
          <Link to="/jobs">
            <button
              type="button"
              className="find-jobs-button"
              // onClick={onClickFindJobs}
            >
              Find Jobs
            </button>
          </Link>
        </div>
      </div>
    </div>
  </>
)

export default Home
