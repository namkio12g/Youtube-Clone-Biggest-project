import spinner from '../../assets/images/xspinner.svg'
import './loadingPage.scss'
const LoadingPage=()=>{
    return(
        <>
        <div className='loading-page'>
            <img className="loading-icon" src={spinner} alt="" />
        </div>
        </>
    )
}
export default LoadingPage;