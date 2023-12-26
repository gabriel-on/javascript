// Breadcrumb.jsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../Breadcrumb/Breadcrumb.css'

const Breadcrumb = () => {
  const location = useLocation();
  const paths = location.pathname.split('/').filter((path) => path !== '');

  return (
    <nav aria-label="breadcrumb">
      <ol className="breadcrumb">
        <li className="breadcrumb-item">
          <Link to="/">Home</Link>
        </li>
        {paths.map((path, index) => (
          <li key={index} className={`breadcrumb-item${index === paths.length - 1 ? ' active' : ''}`}>
            {index === paths.length - 1 ? (
              path
            ) : (
              <span>
                <span className="breadcrumb-separator">{' > '}</span>
                <Link to={`/${paths.slice(0, index + 1).join('/')}`}>{path}</Link>
                <span className="breadcrumb-separator">{' > '}</span>
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumb;