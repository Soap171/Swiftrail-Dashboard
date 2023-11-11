import React, { useState, useEffect } from 'react';
import supabase from '../config/supabaseClient';
import { useAdmin } from './AdminContext';

function TrainScheduleForm() {
  const { adminDetails } = useAdmin();
  const stationId = adminDetails ? adminDetails.stationId : null;
  // Getting the stationId via admin detials


  const [formData, setFormData] = useState({
    scheduleId: '',
    arrivalTime: '',
    departureTime: '',
    finalDestination: '',
    firstClassFees: '',
    secondClassFees: '',
    thirdClassFees: '',
    stopStations: '',
    trainName: '', 
    trainId: '', // Hidden input field for storing trainId
  });

  const [trains, setTrains] = useState([]); 
  const [alert, setAlert] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  useEffect(() => {
    // Fetch the list of trains from the database
    const fetchTrains = async () => {
      try {
        const { data, error } = await supabase.from('train').select('trainId, name');
        if (error) {
          console.error('Error fetching train data:', error);
        } else {
          setTrains(data);
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchTrains();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Split the comma-separated string into an array
      const stopStationsArray = formData.stopStations
        .split(',')
        .map((item) => item.trim());
  
      // Find the selected train's trainId based on the train name
      const selectedTrain = trains.find((train) => train.name === formData.trainName);
  
      if (selectedTrain) {
        formData.trainId = selectedTrain.trainId; // Set the trainId for submission
      } else {
        console.error('Selected train not found in the list of trains.');
        return;
      }
  
      // Create a new schedule object from the form data
      const newSchedule = {
        ...formData,
        stopStations: stopStationsArray,
        stationId: stationId,
      };
  
      // Remove the "trainName" field from the newSchedule object
      delete newSchedule.trainName;
  
      // Insert the new schedule into the Supabase table
      const { data, error } = await supabase.from('schedule').upsert([newSchedule]);
  
      if (error) {
        setAlert({ type: 'danger', message: 'Error inserting data. Please try again.' });
      } else {
        setAlert({ type: 'success', message: 'Data inserted successfully.' });
        // Clear the form
        setFormData({
          scheduleId: '',
          arrivalTime: '',
          departureTime: '',
          finalDestination: '',
          firstClassFees: '',
          secondClassFees: '',
          thirdClassFees: '',
          stopStations: '',
          trainName: '', 
          trainId: '', 
        });
  
        // Clear the success message after a few seconds
        setTimeout(() => {
          setAlert(null);
        }, 5000);
      }
    } catch (error) {
      console.error('Error:', error);
      setAlert({ type: 'danger', message: 'An error occurred. Please try again.' });
    }
  }
  

  return (
    <div className="container mt-4">
      
      {alert && (
        <div className={`alert alert-${alert.type} alert-dismissible fade show`} role="alert">
          {alert.message}
          <button
            type="button"
            className="btn-close"
            data-bs-dismiss="alert"
            aria-label="Close"
            onClick={() => setAlert(null)}
          ></button>
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="scheduleId" className="form-label">Schedule ID:</label>
          <input
            type="text"
            id="scheduleId"
            name="scheduleId"
            value={formData.scheduleId}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="trainName" className="form-label">Select a Train:</label>
          <select
            id="trainName"
            name="trainName"
            value={formData.trainName}
            onChange={handleChange}
            className="form-select"
            required
          >
            <option value="">Select a Train</option>
            {trains.map((train) => (
              <option key={train.trainId} value={train.name}>
                {train.name}
              </option>
            ))}
          </select>
        </div>
        <div className="row">
          <div className="col-md-6">
            <div className="mb-3">
              <label htmlFor="arrivalTime" className="form-label">Arrival Time:</label>
              <input
                type="time"
                id="arrivalTime"
                name="arrivalTime"
                value={formData.arrivalTime}
                onChange={handleChange}
                className="form-control"
                required
              />
            </div>
          </div>
          <div className="col-md-6">
            <div className="mb-3">
              <label htmlFor="departureTime" className="form-label">Departure Time:</label>
              <input
                type="time"
                id="departureTime"
                name="departureTime"
                value={formData.departureTime}
                onChange={handleChange}
                className="form-control"
                required
              />
            </div>
          </div>
        </div>

        <div className="mb-3">
          <label htmlFor="finalDestination" className="form-label">Final Destination:</label>
          <input
            type="text"
            id="finalDestination"
            name="finalDestination"
            value={formData.finalDestination}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>

        <div className="row">
          <div className="col-md-4">
            <div className="mb-3">
              <label htmlFor="firstClassFees" className="form-label">1st Class Fees:</label>
              <input
                type="text"
                id="firstClassFees"
                name="firstClassFees"
                value={formData.firstClassFees}
                onChange={handleChange}
                className="form-control"
              />
            </div>
          </div>
          <div className="col-md-4">
            <div className="mb-3">
              <label htmlFor="secondClassFees" className="form-label">2nd Class Fees:</label>
              <input
                type="text"
                id="secondClassFees"
                name="secondClassFees"
                value={formData.secondClassFees}
                onChange={handleChange}
                className="form-control"
              />
            </div>
          </div>
          <div className="col-md-4">
            <div className="mb-3">
              <label htmlFor="thirdClassFees" className="form-label">3rd Class Fees:</label>
              <input
                type="text"
                id="thirdClassFees"
                name="thirdClassFees"
                value={formData.thirdClassFees}
                onChange={handleChange}
                className="form-control"
                required
              />
            </div>
          </div>
        </div>

        <div className="mb-3">
          <label htmlFor="stopStations" className="form-label">Destinations (Comma-separated):</label>
          <input
            type="text"
            id="stopStations"
            name="stopStations"
            value={formData.stopStations}
            onChange={handleChange}
            className="form-control"
          />
        </div>
        <button type="submit" className="btn btn-primary mb-4">
          Submit
        </button>
      </form>
    </div>
  );
}

export default TrainScheduleForm;
