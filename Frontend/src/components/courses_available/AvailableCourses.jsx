import { useRef, useEffect, useState, useCallback } from 'react'
import { faChevronRight,faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './AvailableCourses.css'

const AvailableCourses = ({ recommendedCourses, grad_year, dark, Loading }) => {
    const [showButtons, setShowButtons] = useState({left:false , right:false});

    const categories = Object.keys(recommendedCourses || {})
    const courseDetailsRefs = useRef([]);
    const checkOverflow = useCallback((index) => {
        const element = courseDetailsRefs.current[index];
        if (element) {
            setShowButtons(prev => ({ ...prev, [index]: { left: element.scrollLeft > 0, right: element.scrollWidth > element.clientWidth && element.scrollLeft + element.clientWidth + 10 < element.scrollWidth } }));
        }
    }, []);

    useEffect(() => {
        Object.keys(recommendedCourses).forEach((_, index) => {
            checkOverflow(index);
        });
    }, [recommendedCourses,checkOverflow]);

    const handleLeft = (index) => {
        if (courseDetailsRefs.current[index]) {
            courseDetailsRefs.current[index].scrollBy({
                left: -350,
                behavior: 'smooth'
                
            })
        }
        setTimeout(() => {
            checkOverflow(index);
        }, 300); 
    }

    const handleRight = (index) => {
        if (courseDetailsRefs.current[index]) {
            courseDetailsRefs.current[index].scrollBy({
                left: 350,
                behavior: 'smooth'
            })
        }
        setTimeout(() => {
            checkOverflow(index);
        }, 300); 
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
                                {showButtons[index]?.left && (
                                    <button className='carousel left' onClick={() => handleLeft(index)}><FontAwesomeIcon icon={faChevronLeft} /></button>
                                )}
                                {showButtons[index]?.right && (
                                    <button className='carousel right' onClick={() => handleRight(index)}><FontAwesomeIcon icon={faChevronRight} /></button>
                                )}

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
