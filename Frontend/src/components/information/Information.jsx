import CGPA from '../cgpa/CGPA'
import CurrentSemester from '../current_semester/CurrentSemester'
import Total from '../total/Total'
import TowardsGrad from '../towardsGrad/TowardsGrad'
import './Information.css'
const Information = ({dark}) => {
  return (
    <div className='information-container'>
        <Total dark={dark}/>
        <CGPA dark={dark}/>
        <CurrentSemester dark={dark}/>
        <TowardsGrad dark={dark}/>
      
    </div>
  )
}

export default Information
