import React, { ChangeEvent, useState } from 'react';

const LocationForm = () => {
  // State to hold the selected location
  const [selectedLocation, setSelectedLocation] = useState('');

  // Array of location options
  const locationOptions = [
    'Option 1',
    'Option 2',
    'Option 3',
    'Option 4',
    // Add more options as needed
  ];

  // Event handler for changing the selected location
  const handleLocationChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setSelectedLocation(event.target.value);
  };

  return (
    <form>
      <label htmlFor="location">Select a Location:</label>
      <select id="location" value={selectedLocation} onChange={handleLocationChange}>
        <option value="" disabled>Select...</option>
        {locationOptions.map((location, index) => (
          <option key={index} value={location}>
            {location}
          </option>
        ))}
      </select>

      {/* Display the selected location */}
      {selectedLocation && <p>Selected Location: {selectedLocation}</p>}
    </form>
  );
};

export default LocationForm;
