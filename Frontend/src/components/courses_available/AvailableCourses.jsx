import { useRef } from 'react'
import './AvailableCourses.css'

const AvailableCourses = ({ recommendedCourses, grad_year, dark, Loading }) => {
    const categories = Object.keys(recommendedCourses || {})
    const courseDetailsRefs = useRef([]);

    const handleLeft = (index) => {
        if(courseDetailsRefs.current[index]) {
            courseDetailsRefs.current[index].scrollBy({
                left: -300,
                behavior: 'smooth'
            })
        }
    }

    const handleRight = (index) => {
         if(courseDetailsRefs.current[index]) {
        courseDetailsRefs.current[index].scrollBy({
            left: 300,
            behavior: 'smooth'
        })
    }
    }


    return (
        <div className={dark ? 'available-courses-container dark-mode-courses' : 'available-courses-container'}>
            {!Loading ? (
                categories.map((cat, index) => (
                    <div className="course-category" key={cat}>
                        <div className="course-category-title">
                            <h3>{getCategoryFullName(cat)} ({cat})</h3>
                        </div>
                        <div className='course-details-wrapper'>
                                <button className='carousel left' onClick={()=>handleLeft(index)}>&lt;</button>
                                <button className='carousel right' onClick={()=>handleRight(index)}>&gt;</button>
                            <div className="course-details" ref={(el) => courseDetailsRefs.current[index] = el}>
                                {recommendedCourses[cat]?.map(course => (
                                    <div className="one-course" key={course._id}>
                                        <p>{course.name}</p>
                                        <p>
                                            {grad_year === "2027" ? course.code19 : course.code24}
                                        </p>
                                        <p>{course.credits} credits</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                ))
            ) : (
                // Skeleton Loading State
                <>
                    {[1, 2].map((fake) => (
                        <div className="course-category" key={fake}>
                            <div className={dark ? 'skeleton-dark skeleton-title' : 'skeleton-light skeleton-title'}>
                                <h3 style={{ visibility: "hidden" }}>Loading...</h3>
                            </div>
                            <div className="course-details">
                                {[1, 2, 3].map((f) => (
                                    <div 
                                      className={dark ? 'skeleton-dark skeleton-card' : 'skeleton-light skeleton-card'} 
                                      key={f}
                                    >
                                        <p style={{ visibility: "hidden" }}>Name</p>
                                        <p style={{ visibility: "hidden" }}>Code</p>
                                        <p style={{ visibility: "hidden" }}>Credits</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </>
            )}
        </div>
    )
}

const getCategoryFullName = (code) => {
    switch (code) {
        case "HS": return "Humanities and Sciences"
        case "BS": return "Basic Sciences"
        case "ES": return "Engineering Sciences"
        case "PC": return "Professional Core"
        case "PE": return "Professional Electives"
        case "EEC": return "Employment Enhancement Courses"
        case "MC": return "Mandatory Courses"
        default: return code
    }
}

export default AvailableCourses
