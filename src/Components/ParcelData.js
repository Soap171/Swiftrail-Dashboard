import React, { useState, useEffect } from 'react';
import supabase from '../config/supabaseClient';
import { useAdmin } from '../Components/AdminContext';
import axios from 'axios';

function ParcelData() {
  const [stationAdminParcels, setStationAdminParcels] = useState([]);
  const [destinationAdminParcels, setDestinationAdminParcels] = useState([]);
  const [searchText, setSearchText] = useState('');
  const { adminDetails } = useAdmin();

  const stationStatusOptions = ['Non', 'Accepted', 'Shipped', 'Failed'];
  const destinationStatusOptions = ['Non','Failed', 'Delivered', 'Completed'];

  useEffect(() => {
    const fetchParcels = async () => {
      try {
        if (adminDetails) {
          const { data, error } = await supabase
            .from('parcelBooking')
            .select('*')
            

          if (error) {
            console.error('Error fetching parcel data:', error);
          } else {
            const stationAdminParcelsData = data.filter(
              (parcel) => parcel.stationId === adminDetails.stationId
            );
            const destinationAdminParcelsData = data.filter(
              (parcel) => parcel.destinationStationId === adminDetails.stationId
            );

            setStationAdminParcels(stationAdminParcelsData);
            setDestinationAdminParcels(destinationAdminParcelsData);
          }
        }
      } catch (error) {
        console.error('Error fetching parcel data:', error);
      }
    };

    fetchParcels();
  }, [adminDetails]);

  const sendSMS = async (phoneNumber, message) => {
    try {
      const response = await axios.post('https://doubtful-hare-sweatshirt.cyclic.app/send-sms', { phoneNumber, message });
      console.log('SMS Sent:', response.data);
      // Optionally, handle success
    } catch (error) {
      console.error('Failed to send SMS:', error);
      // Optionally, handle error
    }
  };


  const updateParcelStatus = async (parcelIndex, newStatus, adminType) => {
    const parcels = adminType === 'station' ? stationAdminParcels : destinationAdminParcels;
    const parcelToUpdate = parcels[parcelIndex];
    const allowedStatusOptions = adminType === 'station' ? stationStatusOptions : destinationStatusOptions;
  
    if (allowedStatusOptions.includes(newStatus)) {
      try {
        // Update the parcel status in the database
        const { data, error } = await supabase
          .from('parcelBooking')
          .update({ status: newStatus })
          .eq('parcelId', parcelToUpdate.parcelId);
  
        if (error) {
          console.error('Error updating parcel status:', error);
        } else {
          // Update the status in the local state
          const updatedParcels = [...parcels];
          updatedParcels[parcelIndex].status = newStatus;
  
          if (adminType === 'station') {
            setStationAdminParcels(updatedParcels);
          } else {
            setDestinationAdminParcels(updatedParcels);
          }
  
          // Send SMS to sender and recipient contact numbers
          const senderContact = parcelToUpdate.senderContactNo;
          const recipientContact = parcelToUpdate.recipientContactNo;
  
          // Your function to send SMS messages to sender and recipient
          await sendSMS(senderContact, `Your parcel with ID ${parcelToUpdate.parcelId} has been updated to ${newStatus}`);
          await sendSMS(recipientContact, `Parcel ID: ${parcelToUpdate.parcelId} status is now ${newStatus}`);
        }
      } catch (error) {
        console.error('Error updating parcel status:', error);
      }
    } else {
      console.error('Invalid status update for this admin type.');
    }
  };

  const updateParcelDetails = async (parcelIndex, adminType, updatedData) => {
    const parcels = adminType === 'station' ? stationAdminParcels : destinationAdminParcels;
    const parcelToUpdate = parcels[parcelIndex];
  
    try {
      const { data, error } = await supabase
        .from('parcelBooking')
        .update(updatedData)
        .eq('parcelId', parcelToUpdate.parcelId);
  
      if (error) {
        console.error('Error updating parcel details:', error);
      }
    } catch (error) {
      console.error('Error updating parcel details:', error);
    }
  };

  const filterParcelsByParcelId = (adminType) => {
    const parcels = adminType === 'station' ? stationAdminParcels : destinationAdminParcels;
    return parcels.filter((parcel) => parcel.parcelId.endsWith(searchText));
  };

  return (
    <div className="container">
      <div className="form-group mt-5">
        <input
          type="text"
          className="form-control mb-4"
          placeholder="Search by Last 4 Digits of Parcel ID"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
      </div>

      <div className="table-responsive mt-5">
      <h3>From This Station to Other Stations</h3>
      <table className="table table-striped table-scroll">
        <thead>
          <tr>
            <th>Parcel ID</th>
            <th>Weight (kg)</th>
            <th>Fee</th>
            <th>Destination</th>
            <th>Update Status</th>
            <th>Parcel Status</th> {/* New column for parcel status */}
          </tr>
        </thead>
        <tbody>
        {filterParcelsByParcelId('station').map((parcel, index) => (
    <tr key={index}>
      <td>{parcel.parcelId}</td>
      <td>
        { /* Input field for weight */ }
        <input
          type="number"
          value={parcel.weight}
          onChange={(e) => {
            const newWeight = e.target.value;
            const updatedParcels = [...stationAdminParcels];
            updatedParcels[index].weight = newWeight;
            setStationAdminParcels(updatedParcels);
            updateParcelDetails(index, 'station', { weight: newWeight });
          }}
          disabled={parcel.status !== ''} // Disables the input if status is not 'Non'

        />
      </td>
      <td>
        { /* Input field for fee */ }
        <input
          type="number"
          value={parcel.fee}
          onChange={(e) => {
            const newFee = e.target.value;
            const updatedParcels = [...stationAdminParcels];
            updatedParcels[index].fee = newFee;
            setStationAdminParcels(updatedParcels);
            updateParcelDetails(index, 'station', { fee: newFee });
          }}

          disabled={parcel.status !== ''} // Disables the input if status is not 'Non'
        />
      </td>
      <td>{parcel.destinationStationId}</td>
      <td>
                {parcel.status === 'Failed' ? (
                  <span>None</span>
                ) : (
                  <select
                    className="form-control"
                    value={parcel.status}
                    onChange={(e) => updateParcelStatus(index, e.target.value, 'station')}
                  >
                    {stationStatusOptions.map((status, statusIndex) => (
                      <option key={statusIndex} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                )}
              </td>
      <td>{parcel.status}</td>
    </tr>
  ))}
        </tbody>
      </table>
    </div>
    <div className="table-responsive mt-5 mb-5">
      <h3>From Other Stations to this Station</h3>
      <table className="table table-striped table-scroll">
        <thead>
          <tr>
            <th>Parcel ID</th>
            <th>Weight (kg)</th>
            <th>Fee</th>
            <th>From</th>
            <th>Update Status</th>
            <th>Parcel Status</th> {/* New column for parcel status */}
          </tr>
        </thead>
        <tbody>
          {filterParcelsByParcelId('destination').map((parcel, index) => (
            <tr key={index}>
              <td>{parcel.parcelId}</td>
              <td>{parcel.weight}</td>
              <td>{parcel.fee}</td>
              <td>{parcel.stationId}</td>
              <td>
                {parcel.status === 'Failed' ? (
                  <span>None</span>
                ) : (
                  <select
                    className="form-control"
                    value={parcel.status}
                    onChange={(e) => updateParcelStatus(index, e.target.value, 'destination')}
                  >
                    {destinationStatusOptions.map((status, statusIndex) => (
                      <option key={statusIndex} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                )}
              </td>
              <td>{parcel.status}</td> {/* Displaying parcel status */}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
  );
}

export default ParcelData;
