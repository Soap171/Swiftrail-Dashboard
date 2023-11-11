import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

function Footer() {
  const subscribeToNewsletter = (e) => {
    e.preventDefault();
    window.location.href = 'https://swiftrailblog.hashnode.dev/newsletter'; 
  };


  return (
    <footer className="footer bg-dark text-white py-5">
      <div className="container">
        <div className="row">
          <div className="col-lg-4 col-md-6">
            <div className="social-icons mb-4">  
              <a href="https://web.facebook.com/profile.php?id=61552963589253" target='_blank' className="text-white me-3">
                <i className="fab fa-facebook"></i>
              </a>
              <a href="https://twitter.com/SwiftRail_org" target='_blank' className="text-white me-3">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="https://www.instagram.com/swiftrail_srilanka/" target='_blank' className="text-white me-3">
                <i className="fab fa-instagram"></i>
              </a>
            </div>

            <div className="mb-4">
              <h5>Contact Us</h5>
              <a href='mailto: admin@swiftrail.org' className='footer-link'>Email: admin@swiftrail.org</a>
               <p> <a href="tel:+94713652180" className='footer-link'>Mobile: +94 713652180</a></p>
            </div>
          </div>

          <div className="col-lg-4 col-md-6">
            <div className="mb-4">
              <h5>Quick Links</h5>
              <ul className="list-unstyled">
                <li>
                  <Link to="/Dashboard" className="footer-link">
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link to="/Parcel_Management" className="footer-link">
                    Parcel Management
                  </Link>
                </li>
                <li>
                  <Link to="/QR_Scanner" className="footer-link">
                    QR Scanner
                  </Link>
                </li>
                
                
              </ul>
            </div>
          </div>

          <div className="col-lg-4 col-md-12">
            <div className="mb-4">
              <h5>Subscribe to Our Newsletter</h5>
              <form onSubmit={subscribeToNewsletter}>
                <div className="input-group">
                  <input type="email" className="form-control" placeholder="Enter your email" />
                  <button className="btn btn-success" type="submit">Subscribe</button>
                </div>
              </form>
            </div>
          </div>
        </div>

        <div className="text-center">
          <p>&copy; {new Date().getFullYear()} SwiftRail. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
