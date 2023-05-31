import Header from '../Header'
import './index.css'

const Home = props => {
  const onClickFindJobs = () => {
    console.log(props)
    const {history} = props
    history.replace('/jobs')
  }
  return (
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
            <button
              type="button"
              className="find-jobs-button"
              onClick={onClickFindJobs}
            >
              Find Jobs
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
export default Home
