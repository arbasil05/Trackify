import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './Category.css';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const Category = ({ dark, runningTotal, Loading }) => {
  const [courses, setCourses] = useState([
    { name: 'HS', full: 'Humanities and Sciences' },
    { name: 'BS', full: 'Basic Sciences' },
    { name: 'ES', full: 'Engineering Sciences' },
    { name: 'PC', full: 'Professional Core' },
    { name: 'PE', full: 'Professional Electives' },
    { name: 'OE', full: 'Open Electives' },
    { name: 'EEC', full: 'Employment Enhancement Courses' },
    { name: 'MC', full: 'Mandatory Courses' },
  ]);

  useEffect(() => {
    if (!runningTotal) return;

    const updatedCourses = courses.map(course => ({
      ...course,
      credits: runningTotal[course.name] || 0,
    }));

    setCourses(updatedCourses);
  }, [runningTotal]);

  return (
    !Loading ? (
      <div
        className="category-container"
        style={{
          backgroundColor: dark ? '#273142' : '#ffffff',
          color: dark ? 'white' : 'black',
        }}
      >
        <h2
          className="category-title"
          style={{
            color: dark ? 'white' : '#1f2937',
          }}
        >
          Explore Categories
        </h2>

        <div className="category-grid">
          {courses.map((course, index) => (
            <div
              className="individual-category"
              key={index}
              style={{
                backgroundColor: dark ? '#323f4b' : '#f9fafb',
                color: dark ? '#e2e8f0' : 'black',
              }}
            >
              <div className="individual-title">
                <h1 style={{ color: dark ? 'white' : '#111827' }}>{course.name}</h1>
                <p style={{ color: dark ? '#cbd5e1' : '#6b7280' }}>{course.full}</p>
              </div>
              <div className="individual-right">
                <Link to={`/category/${course.name}`}>
                <FontAwesomeIcon className='individual-right-icon' icon={faChevronRight} color={dark ? 'white' : '#4b5563'} />
                </Link>
                <h3 style={{ color: dark ? 'white' : '#1f2937' }}>
                  {course.credits !== undefined ? `${course.credits} credits` : '...'}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    ) : (
      <div
        className={
          dark
            ? 'category-container dark-mode skeleton-dark'
            : 'category-container skeleton-light'
        }
      >
        <h2
          className="category-title"
          style={{
            color: dark ? 'white' : '#1f2937',
            visibility: 'hidden',
          }}
        >
          Explore Categories
        </h2>

        <div className="category-grid">
          {courses.map((course, index) => (
            <div
              className="individual-category"
              key={index}
              style={{
                backgroundColor: dark ? '#323f4b' : '#f9fafb',
                color: dark ? '#e2e8f0' : 'black',
                visibility: 'hidden',
              }}
            >
              <div className="individual-title">
                <h1 style={{ color: dark ? 'white' : '#111827' }}>{course.name}</h1>
                <p style={{ color: dark ? '#cbd5e1' : '#6b7280' }}>{course.full}</p>
              </div>
              <div className="individual-right">
                <FontAwesomeIcon icon={faChevronRight} color={dark ? 'white' : '#4b5563'} />
                <h3 style={{ color: dark ? 'white' : '#1f2937' }}>
                  {course.credits !== undefined ? `${course.credits} credits` : '...'}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  );
};

export default Category;