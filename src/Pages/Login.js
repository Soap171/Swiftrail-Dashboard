import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.css';
import './Login.css';
import { useAdmin } from '../Components/AdminContext';
import supabase from '../config/supabaseClient';

function Login() {
  const navigate = useNavigate();
  const { loginAdmin } = useAdmin();
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      // Query to 'stationAdmin' table to check if the provided username and password exist
      const { data, error } = await supabase
        .from('railwayStation')
        .select('stationId, userName, email,password,city')
        .eq('userName', userName)
        .eq('password', password);

      if (error) {
        console.error('Error querying Supabase:', error);
        return;
      }

      if (data.length === 1) {
        // store admin details in the context
        loginAdmin(data[0]);

        // Then direct to the admin dashboard
        navigate('/Dashboard');
      } else {
        alert('Login failed. Please check your credentials.');
      }
    } catch (error) {
      console.error('Error during login:', error);
    }
  }

  return (
    <div className="login-container">
      <div className="login-panel">
        <div className="card">
          <div className="card-header text-center bg-primary text-white">
            SwiftRail
          </div>
          <div className="card-body">
            <form onSubmit={handleLogin}>
              <div className="form-group">
                <label htmlFor="userName">User name</label>
                <input
                  type="text"
                  className="form-control"
                  id="userName"
                  placeholder="Enter User Name"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  className="form-control"
                  id="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <button type="submit" className="btn btn-primary btn-block">
                    Login
              </button>
            </form>
          </div>
        </div>
      </div>
      <div className="contact-button">
        <a href='mailto:admin@swiftrail.org' className='btn btn-secondary btn-lg'>Contact</a>
      </div>
    </div>
  );
}

export default Login;
