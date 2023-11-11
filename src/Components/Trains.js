import React, { useEffect, useState } from 'react';
import supabase from '../config/supabaseClient';

function Trains() {
  const [trainsData, setTrainsData] = useState([]);
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    // Fetch train data when the component mounts
    fetchTrainsData();
  }, []);

  const fetchTrainsData = async () => {
    try {
      // Use Supabase client to fetch data from the 'trains' table
      const { data, error } = await supabase.from('train').select('trainId, name');

      if (error) {
        console.error('Error fetching train data:', error);
      } else {
        setTrainsData(data);
      }
    } catch (error) {
      console.error('Error fetching train data:', error);
    }
  };

  // Function to filter trains based on search text
  const filteredTrains = trainsData.filter((train) => {
    return (
      train.trainId.includes(searchText) ||
      train.name.toLowerCase().includes(searchText.toLowerCase())
    );
  });

  return (
    <div className="container mt-4 mb-4">
      

      {/* Search input */}
      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Search Trains by ID or Name"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
      </div>

      <div className="table-responsive">
        <table className="table table-bordered table-striped">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
            </tr>
          </thead>
          <tbody>
            {filteredTrains.map((train) => (
              <tr key={train.trainId}>
                <td>{train.trainId}</td>
                <td>{train.name}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Trains;
