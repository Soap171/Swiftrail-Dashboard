import React, { createContext, useContext, useState } from 'react';

// use to pass the admin details to other pages
const AdminContext = createContext();

export function AdminProvider({ children }) {

  // Initialize adminDetails with data from local storage, if available
  const [adminDetails, setAdminDetails] = useState(() => {
    const storedDetails = localStorage.getItem('adminDetails');
    return storedDetails ? JSON.parse(storedDetails) : null;
  });

  const loginAdmin = (details) => {
    setAdminDetails(details);
    // Store admin details in local storage until log out
    localStorage.setItem('adminDetails', JSON.stringify(details));
  };

  const logoutAdmin = () => {
    setAdminDetails(null);
    // Remove admin details from local storage
    localStorage.removeItem('adminDetails');
  };

  return (
    <AdminContext.Provider value={{ adminDetails, loginAdmin, logoutAdmin }}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  return useContext(AdminContext);
}
