import React, { useState } from 'react';
import './ButtonMargins.css';

function EditScheduleForm({ schedule, availableTrains, onUpdate, onCancel }) {
  const initialEditedSchedule = { ...schedule, stopStations: [] }; // Ensure stopStations is initialized as an array
  const [editedSchedule, setEditedSchedule] = useState(initialEditedSchedule);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedSchedule({ ...editedSchedule, [name]: value });
  };

  const handleStopStationsChange = (e) => {
    const { value } = e.target;
    const stopStations = value.split(', ').map((station) => station.trim()); // Split the input string into an array
    setEditedSchedule({ ...editedSchedule, stopStations });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate(editedSchedule);
  };

  return (
    <form onSubmit={handleSubmit} className="my-4 mt-5">
      <h2>Edit Train Schedules</h2>
      <div className="row">
        <div className="col-md-6">
          <div className="form-group">
            <label>Schedule ID:</label>
            <input type="text" name="scheduleId" value={editedSchedule.scheduleId} className="form-control" readOnly />
          </div>
          <div className="form-group">
            <label>Arrival Time:</label>
            <input type="time" name="arrivalTime" value={editedSchedule.arrivalTime} onChange={handleChange} className="form-control" />
          </div>
          <div className="form-group">
            <label>Departure Time:</label>
            <input type="time" name="departureTime" value={editedSchedule.departureTime} onChange={handleChange} className="form-control" />
          </div>
        </div>
        <div className="col-md-6">
          <div className="form-group">
            <label>Train ID:</label>
            <div className="position-relative">
              <select
                name="trainId"
                value={editedSchedule.trainId}
                onChange={handleChange}
                className="form-control"
              >
                <option value="">Select a train</option>
                {availableTrains.map((train) => (
                  <option key={train.trainId} value={train.trainId}>
                    {train.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="form-group">
            <label>Final Destination:</label>
            <input type="text" name="finalDestination" value={editedSchedule.finalDestination} onChange={handleChange} className="form-control" />
          </div>
          <div className="form-group">
            <label>1st Class Fees:</label>
            <input type="text" name="firstClassFees" value={editedSchedule.firstClassFees} onChange={handleChange} className="form-control" />
          </div>
          <div className="form-group">
            <label>2nd Class Fees:</label>
            <input type="text" name="secondClassFees" value={editedSchedule.secondClassFees} onChange={handleChange} className="form-control" />
          </div>
          <div className="form-group">
            <label>3rd Class Fees:</label>
            <input type="text" name="thirdClassFees" value={editedSchedule.thirdClassFees} onChange={handleChange} className="form-control" />
          </div>
          <div className="form-group">
            <label>Stop Stations:</label>
            <input
              type="text"
              name="stopStations"
              value={editedSchedule.stopStations.join(', ')} // Convert array to comma-separated string
              onChange={handleStopStationsChange}
              className="form-control"
            />
          </div>
        </div>
      </div>

      <div className="text-center">
        <button type="submit" className="btn btn-primary btn-sm btn1">Save</button>
        <button type="button" onClick={onCancel} className="btn btn-danger btn-sm btn2">Cancel</button>
      </div>
    </form>
  );
}

export default EditScheduleForm;
