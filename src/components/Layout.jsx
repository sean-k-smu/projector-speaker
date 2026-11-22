/**
 * @authors
 * Ornella Ingrid Uwayo (A00466302)
 * 
 */

import React from 'react';
import Navigation from './Navigation';


/**
 * Shared layout for the application.
 * Displays the navigation bar and background wrapper
 * around the current page content.
 */
function Layout({ dark, toggleDarkMode, children }) {
  return (
    <div className="bg-yellow-100 dark:bg-blue-900 min-h-screen">
      <Navigation
        toggleDarkMode={toggleDarkMode}
        dark={dark}
      />


      {children}
    </div>
  );
};


export default Layout;