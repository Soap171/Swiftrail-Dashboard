import React from 'react'
import Navbar from '../Components/Navbar'
import Footer from '../Components/Footer'
import Schedulesimg from '../Assets/Schedules.jpg'
import Hero from '../Components/Hero'
import Schedules from '../Components/Schedules'
import TableSchedules from '../Components/TableSchedules'

function Train_Schedules() {
  return (
    <>
     <Navbar/>
     <Hero
    cName = "hero-other"
    heroImg = {Schedulesimg}
    title = "Manage All Train Schedules "
    />
    <Schedules/>
    <TableSchedules/>
    <Footer/>
    </>
  )
}

export default Train_Schedules
