//dashboard
"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import '../css/dashboard.css';
import Layout from '../Components/Layout';
import Header from '../Components/Header';




export default function Dashboard() {
  const router = useRouter();
  const [modules, setModules] = useState([]);
  const [generalModules, setGeneralModules] = useState([]);
  const [username, setUsername] = useState('');
  const [userYear, setUserYear] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showModulesPopup, setShowModulesPopup] = useState(false);
  const [dashboardModules, setDashboardModules] = useState([]);

  useEffect(() => {
    const fetchModules = async () => {
      try {
        const userId = getUserIdFromCookies();
        const response = await fetch(`api/getModules?userId=${userId}`);
        if (!response.ok) throw new Error('Failed to fetch');
        const data = await response.json();
        setModules(data.modules);
        const dashboardModulesKey = `dashboardModules-${userId}`;
        setDashboardModules(JSON.parse(localStorage.getItem(dashboardModulesKey)) || []);
      } catch (error) {
        console.error('Error fetching modules:', error);
      }
    };

    const fetchGeneralModules = async () => {
      try {
        const response = await fetch(`/api/getGeneral`);
        if (!response.ok) throw new Error('Failed to fetch');
        const data = await response.json();
        setGeneralModules(data.modules);
      } catch (error) {
        console.error('Error fetching general modules:', error);
      }
    };

    const getUserDataFromCookies = () => {
      const allCookies = document.cookie.split('; ');
      const usernameCookie = allCookies.find((cookie) => cookie.startsWith('username='));
      const yearCookie = allCookies.find((cookie) => cookie.startsWith('year='));
      const username = usernameCookie ? decodeURIComponent(usernameCookie.split('=')[1]) : '';
      const year = yearCookie ? decodeURIComponent(yearCookie.split('=')[1]) : '';
      return { username, year };
    };

    const { username, year } = getUserDataFromCookies();
    setUsername(username);
    setUserYear(year);

    if (!username) {
      router.replace('/login');
    } else {
      fetchModules();
      fetchGeneralModules();
    }
  }, [router]);

  const getUserIdFromCookies = () => {
    const allCookies = document.cookie.split('; ');
    const userIdCookie = allCookies.find(cookie => cookie.startsWith('userId='));
    return userIdCookie ? decodeURIComponent(userIdCookie.split('=')[1]) : null;
  };

  const handleViewModulesClick = () => {
    setShowModulesPopup(true);
  };

  const handleAddModule = (module) => {
    const isModuleAlreadyAdded = dashboardModules.some(
      (existingModule) => existingModule._id === module._id
    );
  
    if (isModuleAlreadyAdded) {
      console.log('Module is already added to the dashboard');
      return;
    }
    const userId = getUserIdFromCookies();
    const dashboardModulesKey = `dashboardModules-${userId}`;
    const updatedModule = [...dashboardModules, module];
    setDashboardModules(updatedModule);
    localStorage.setItem(dashboardModulesKey, JSON.stringify(updatedModule));
    refreshPopup(); // Refresh the popup after adding a module
  };

  const handleRemoveModule = (moduleToRemove) => {
    const userId = getUserIdFromCookies();
    const dashboardModulesKey = `dashboardModules-${userId}`;
    const updatedModule = dashboardModules.filter(module => module._id !== moduleToRemove._id);
    setDashboardModules(updatedModule);
    localStorage.setItem(dashboardModulesKey, JSON.stringify(updatedModule));
    refreshPopup(); // Refresh the popup after removing a module
  };

  const handleModuleClick = (moduleId) => {
    localStorage.setItem('currentModuleId', moduleId);
    router.push(`/modules/${moduleId}`);
  };

  const handleResultsClick = (moduleId) => {
    localStorage.setItem('currentModuleId', moduleId);
    router.push(`/modules/${moduleId}`);
  };
  
  // Function to refresh the popup
  const refreshPopup = () => {
    setShowModulesPopup(true);
  };

  return (
    <Layout setSearchResults={setSearchResults}>
      <Header setSearchResults={setSearchResults} />
      {showModulesPopup && (
        <div className="popup-overlay">
          <div className="popup-content">
            <span className="close" onClick={() => setShowModulesPopup(false)}>&times;</span>
            <h2>All Modules</h2>
            <div className="module-list">
              <ul>
                {modules.map((module) => (
                  <li key={module._id}>
                    <p>{module.code} - Year {module.year}</p>
                    <h3>{module.title}</h3>
                    <p>{module.description}</p>
                    <button onClick={() => handleAddModule(module)}>Add Module</button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
      <br/>
      <br/>
      <div className="banner">
        <center><h1>Welcome back, We've missed you! 👋</h1></center>
      </div>
      <br/>
      <div className="main-container">
        <div className="dashboard-container">
          <section className="main-content">
            <div className="side-bar left">
              <center><h2>Your Modules</h2></center>
                {dashboardModules.map((module) => (
                  <div key={module._id}>
                    <div className='module'>
                      <center>
                      <h4>{module.title}</h4>
                      <small>{module.code} - Year {module.year}</small>
                      <br/>
                      <br/>
                      <button id='see-module' onClick={() => handleModuleClick(module._id)}>See Module</button><button onClick={() => handleRemoveModule(module)}>🗑️</button>
                      </center>
                    </div>
                  </div>
                ))}
            </div>
            <div className="side-bar right">
              <center><h2>Let's get you sorted...</h2></center>
              <br/>
              <center><bold><h3>In order to get started, let's see which modules you want to 
                add to your dashboard. To get
                started, just click the button!
              </h3></bold></center>
              <br/>
              <center><bold><h3>In order to view posts for a specific subject, just add a module from
                the list and begin chatting with like-minded about a variety of topics in a matter of
                seconds.
              </h3></bold></center>
              <center><button className="view-modules" onClick={handleViewModulesClick}>View Modules</button></center>
              <br/>
            </div>
          </section>
        </div>
      </div>
      <style jsx>{`
        // Your CSS styles
      `}</style>
    </Layout>
  );
}
