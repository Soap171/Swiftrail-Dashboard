import React, { useState, useEffect } from 'react';
import supabase from '../config/supabaseClient';
import { useAdmin } from './AdminContext';

function ParcelDataAll() {
  const [parcels, setParcels] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [filteredParcels, setFilteredParcels] = useState([]);
  const { adminDetails } = useAdmin();

  useEffect(() => {
    async function fetchParcels() {
      try {
        if (adminDetails) {
          // Fetch parcel data based on the admin's stationId
          const { data, error } = await supabase
            .from('parcelBooking')
            .select('*')
            .eq('stationId', adminDetails.stationId);
          if (error) {
            console.error('Error fetching parcel data:', error);
          } else {
            setParcels(data);
            setFilteredParcels(data);
          }
        }
      } catch (error) {
        console.error('Error fetching parcel data:', error);
      }
    }
    fetchParcels();
  }, [adminDetails]);

  useEffect(() => {
    // Filter parcels based on the last 4 digits of the parcel ID when the search text changes
    setFilteredParcels(parcels.filter((parcel) => parcel.parcelId.endsWith(searchText)));
  }, [searchText, parcels]);

  return (
    <div className="container">
      <h2>All Parcel Details Of This Station</h2>
      <div className="form-group">
        <input
          type="text"
          className="form-control"
          placeholder="Search by Last 4 Digits of Parcel ID"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
      </div>
      <div className="table-responsive mb-5">
        <table className="table table-striped table-scroll">
          <thead>
            <tr>
              <th>Parcel ID</th>
              <th>Destination Station</th>
              <th>Weight (kg)</th>
              <th>Fee</th>
              <th>Status</th>
              <th>Recipient Contact</th>
              <th>Recipient NIC</th>
              <th>Recipient Name</th>
              <th>Sender Contact</th>
              <th>Sender NIC</th>
              <th>Sender Name</th>
            </tr>
          </thead>
          <tbody>
            {filteredParcels.map((parcel, index) => (
              <tr key={index}>
                <td>{parcel.parcelId}</td>
                <td>{parcel.destinationStationId}</td>
                <td>{parcel.weight}</td>
                <td>{parcel.fee}</td>
                <td>{parcel.status}</td>
                <td>{parcel.recipientContactNo}</td>
                <td>{parcel.recipientNIC}</td>
                <td>{parcel.recipientName}</td>
                <td>{parcel.senderContactNo}</td>
                <td>{parcel.senderNIC}</td>
                <td>{parcel.senderName}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ParcelDataAll;
