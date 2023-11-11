import React, { useEffect, useState } from 'react';
import supabase from '../config/supabaseClient';
import EditScheduleForm from './EditScheduleForm';
import { useAdmin } from './AdminContext';
import './ButtonMargins.css';

function TableSchedules() {
  const { adminDetails } = useAdmin();
  const stationId = adminDetails ? adminDetails.stationId : null;

  const [schedules, setSchedules] = useState([]);
  const [editingSchedule, setEditingSchedule] = useState(null);
  const [availableTrains, setAvailableTrains] = useState([]); // Add state for available trains

  useEffect(() => {
    async function fetchSchedules() {
      try {
        if (stationId) {
          // Fetch the data from the Supabase table for your stationId
          const { data, error } = await supabase
            .from('schedule')
            .select('*, trainId:trainId(name)') // Include train name using a relationship
            .eq('stationId', stationId);

          if (error) {
            console.error('Error fetching data:', error);
          } else {
            setSchedules(data);
          }
        }
      } catch (error) {
        console.error('Error:', error);
      }
    }

    async function fetchTrains() {
      try {
        // Fetch the list of available trains
        const { data, error } = await supabase.from('train').select('trainId, name');

        if (error) {
          console.error('Error fetching trains:', error);
        } else {
          setAvailableTrains(data);
        }
      } catch (error) {
        console.error('Error:', error);
      }
    }

    fetchSchedules();
    fetchTrains(); // Fetch available trains
  }, [stationId]);

  const handleEditSchedule = (schedule) => {
    setEditingSchedule(schedule);
  };

  const handleUpdateSchedule = async (updatedSchedule) => {
    try {
      // Update the schedule in the Supabase table
      const { data, error } = await supabase.from('schedule').upsert([updatedSchedule]);

      if (error) {
        console.error('Error updating schedule:', error);
      } else {
        // Update the local state with the edited schedule
        setSchedules((prevSchedules) =>
          prevSchedules.map((schedule) =>
            schedule.scheduleId === updatedSchedule.scheduleId ? updatedSchedule : schedule
          )
        );
        setEditingSchedule(null);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }

  const handleDeleteSchedule = async (scheduleId) => {
    const confirmation = window.confirm('Are you sure you want to delete this schedule?');

    if (confirmation) {
      try {
        // Delete the schedule from the Supabase table
        const { error } = await supabase
          .from('schedule')
          .delete()
          .eq('scheduleId', scheduleId);

        if (error) {
          console.error('Error deleting schedule:', error);
        } else {
          // Remove the deleted schedule from the local state
          setSchedules((prevSchedules) =>
            prevSchedules.filter((schedule) => schedule.scheduleId !== scheduleId)
          );
          setEditingSchedule(null);
        }
      } catch (error) {
        console.error('Error:', error);
      }
    }
  }

  return (
    <div className="container">
      <h2 className="text-center mt-4">Available Train Schedules</h2>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Schedule ID</th>
            <th>Train Name</th>
            <th>Arrival Time</th>
            <th>Departure Time</th>
            <th>Final Destination</th>
            <th>1st Class Fees</th>
            <th>2nd Class Fees</th>
            <th>3rd Class Fees</th>
            <th>Stop Stations</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {schedules.map((schedule) => (
            <tr key={schedule.scheduleId}>
              <td>{schedule.scheduleId}</td>
              <td>{schedule.trainId ? schedule.trainId.name : 'N/A'}</td>
              <td>{schedule.arrivalTime}</td>
              <td>{schedule.departureTime}</td>
              <td>{schedule.finalDestination}</td>
              <td>{schedule.firstClassFees}</td>
              <td>{schedule.secondClassFees}</td>
              <td>{schedule.thirdClassFees}</td>
              <td>{schedule.stopStations ? schedule.stopStations.join(', ') : 'N/A'}</td>
              <td>
                <button onClick={() => handleEditSchedule(schedule)} className='btn btn-primary btn-sm btn1'>Edit</button>
                <button onClick={() => handleDeleteSchedule(schedule.scheduleId)} className='btn btn-danger btn-sm btn2'>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {editingSchedule && (
        <EditScheduleForm
          schedule={editingSchedule}
          availableTrains={availableTrains} // Pass availableTrains as a prop
          onUpdate={(updatedSchedule) => handleUpdateSchedule(updatedSchedule)}
          onCancel={() => setEditingSchedule(null)}
        />
      )}
    </div>
  );
}

export default TableSchedules;
