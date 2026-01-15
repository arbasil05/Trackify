import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './Category.css';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons';
import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';

const CATEGORIES = [
  { name: 'HS', full: 'Humanities and Sciences' },
  { name: 'BS', full: 'Basic Sciences' },
  { name: 'ES', full: 'Engineering Sciences' },
  { name: 'PC', full: 'Professional Core' },
  { name: 'PE', full: 'Professional Electives' },
  { name: 'OE', full: 'Open Electives' },
  { name: 'EEC', full: 'Employment Enhancement Courses' },
  { name: 'MC', full: 'Mandatory Courses' },
];

const Category = ({ runningTotal, Loading }) => {
  const { isDark: dark } = useTheme();
  const courses = CATEGORIES.map(course => ({
    ...course,
    credits: runningTotal ? runningTotal[course.name] : undefined,
  }));

  return (
    !Loading ? (
      <div className={`trackify-category-container ${dark ? 'dark' : ''}`}>
        <h2 className="category-title">
          Explore Categories
        </h2>

        <div className="category-grid">
          {courses.map((course, index) => (
            <React.Fragment key={index}>
            <Link to={`/category/${course.name}`}>
            <div className={`individual-category ${dark ? 'dark' : ''}`}>
              <div className="individual-title">
                <h1>{course.name}</h1>
                <p>{course.full}</p>
              </div>
              <div className="individual-right">
                <FontAwesomeIcon className='individual-right-icon' icon={faChevronRight} />
                <h3>
                  {course.credits !== undefined ? `${course.credits} credits` : '...'}
                </h3>
              </div>
            </div>
          </Link>
          </React.Fragment>
          ))}
        </div>
      </div>
    ) : (
      <div className={`trackify-category-container ${dark ? 'dark skeleton-dark' : 'skeleton-light'}`}>
        <h2 className="category-title" style={{ visibility: 'hidden' }}>
          Explore Categories
        </h2>

        <div className="category-grid">
          {courses.map((course, index) => (
            <div
              className={`individual-category ${dark ? 'dark' : ''}`}
              key={index}
              style={{ visibility: 'hidden' }}
            >
              <div className="individual-title">
                <h1>{course.name}</h1>
                <p>{course.full}</p>
              </div>
              <div className="individual-right">
                <FontAwesomeIcon icon={faChevronRight} />
                <h3>
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