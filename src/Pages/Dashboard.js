import React from 'react'
import Navbar from '../Components/Navbar'
import Footer from '../Components/Footer'
import Hero from '../Components/Hero'
import dashbaordImg from '../Assets/dashboard.jpg'
import AdminDetails from '../Components/AdminDetails'
import RailwayStations from '../Components/RailwayStations'
import Trains from '../Components/Trains'

function Dashboard() {

  

  return (
    <>
    <Navbar/>
    <Hero
    cName = "hero"
    heroImg = {dashbaordImg}
    title = "Manage All Ongoing Process With SwiftRail"
    text = "The Swiftrail admin dashboard streamlines railway station operations with features like schedule management, parcel bookings, and QR ticketing. It provides real-time insights, enhances security, and offers a user-friendly interface to boost efficiency and service quality"
    />
    <AdminDetails/>
    <RailwayStations/>
    <Trains/>
    
 
    
    <Footer/>
    </>
  )
}

export default Dashboard
