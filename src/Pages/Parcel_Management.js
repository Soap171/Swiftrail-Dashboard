import React from 'react'
import Navbar from '../Components/Navbar'
import Footer from '../Components/Footer'
import Hero from '../Components/Hero'
import ParcelImg from '../Assets/Parcel.jpg'
import ParcelData from '../Components/ParcelData'
import ParcelDataAll from '../Components/ParcelDataAll'
import RailwayStations from '../Components/RailwayStations'

function Parcel_Management() {
  return (
   <>
    <Navbar/>
    <Hero
    cName = "hero-other"
    heroImg = {ParcelImg}
    title = "Accept All Parcel Requests"
    />
    <ParcelData/>
    <ParcelDataAll/>
    <RailwayStations/>
    <Footer/>
   </>
  )
}

export default Parcel_Management
