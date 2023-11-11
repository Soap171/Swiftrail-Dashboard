import React, { useEffect, useState } from 'react';
import supabase from '../config/supabaseClient';

function RailwayStations() {
  const [railwayStationsData, setRailwayStationsData] = useState([]);
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    // Fetch railway stations data when the component mounts
    fetchRailwayStationsData();
  }, []);

  const fetchRailwayStationsData = async () => {
    try {
      // Use Supabase client to fetch data from the 'railwayStations' table
      const { data, error } = await supabase
        .from('railwayStation')
        .select('stationId, city, contactNo');

      if (error) {
        console.error('Error fetching railway stations data:', error);
      } else {
        setRailwayStationsData(data);
      }
    } catch (error) {
      console.error('Error fetching railway stations data:', error);
    }
  };

  // Function to filter stations based on search text
  const filteredStations = railwayStationsData.filter((station) => {
    return (
      station.stationId.includes(searchText) ||
      station.city.toLowerCase().includes(searchText.toLowerCase())
    );
  });

  return (
    <div className="container mt-4 mb-4">
      

      {/* Search input */}
      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Search Railway Stations by ID or City"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
      </div>

      <div className="table-responsive">
        <table className="table table-bordered table-striped">
          <thead>
            <tr>
              <th>Station ID</th>
              <th>City</th>
              <th>Contact Number</th>
            </tr>
          </thead>
          <tbody>
            {filteredStations.map((station) => (
              <tr key={station.stationId}>
                <td>{station.stationId}</td>
                <td>{station.city}</td>
                <td>{station.contactNo}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default RailwayStations;
