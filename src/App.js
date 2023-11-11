import Dashboard from './Pages/Dashboard';
import Login from './Pages/Login';
import QR_Scanner from './Pages/QR_Scanner';
import Parcel_Management from './Pages/Parcel_Management'
import Train_Schedules from './Pages/Train_Schedules'
import './Style.css'
import { Route, Routes } from 'react-router-dom';
import { AdminProvider } from '../src/Components/AdminContext'; // Import the AdminProvider
import { BrowserRouter } from 'react-router-dom';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
      <AdminProvider>
      <Routes>
       <Route path="/" element={ <Login/>}/>
       <Route path="/Dashboard" element={ <Dashboard/>}/>
       <Route path="/QR_Scanner" element={ <QR_Scanner/>}/>
       <Route path="/Parcel_Management" element={ <Parcel_Management/>}/>
       <Route path="/Train_Schedules" element={ <Train_Schedules/>}/>
      </Routes>
      </AdminProvider>
      </BrowserRouter>
      
    </div>
  );
}

export default App;
