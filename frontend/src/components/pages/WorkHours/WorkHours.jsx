import React, { useEffect, useState } from 'react';
import { useAuth } from '../../../context/Context';
import EditPopup from './EditPopup';


function WorkHours() {
  const { userId } = useAuth();

  const [date, setDate] = useState("");
  const [hoursWorked, setHoursWorked] = useState(0);
  const [overtime, setOvertime] = useState(0);
  const [workHours, setWorkHours] = useState([]);
  const [isEditPopupOpen, setEditPopupOpen] = useState(false);
  const [selectedWorkDay, setSelectedWorkDay] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(null);


  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/workHours?userId=${userId}`)
      .then((response) => {
        if (!response.ok) {
          return Promise.reject('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        const formattedWorkHours = data.workHours.map((entry) => {
          // Convert the timestamp to a Date object
          const date = new Date(entry.date._seconds * 1000 + entry.date._nanoseconds / 1000000);
          return {
            ...entry,
            date: date.toLocaleDateString(), // Format date as a readable string
          };
        });
        setWorkHours(formattedWorkHours);
      })
      .catch((error) => {
        console.error('Error fetching sick leave data:', error);
      });
  }, [userId])

  const handleSubmit = (e) => {
    e.preventDefault();
    const newHours = {
      date: date,
      hours: hoursWorked,
      overtime: overtime
    };


    fetch(`${process.env.REACT_APP_API_URL}/workHours?userId=${userId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newHours),
    })
      .then((response) => response.json())
      .then((data) => {
        const formattedWorkHours = data.workHours.map((entry) => {
          // Convert the timestamp to a Date object
          const date = new Date(entry.date._seconds * 1000 + entry.date._nanoseconds / 1000000);
          return {
            ...entry,
            date: date.toLocaleDateString(), // Format date as a readable string
          };
        });
        setWorkHours(formattedWorkHours);
      })
      .catch((error) => {
        console.error('Error adding new sick leave:', error);
      });

    setDate("");
  };

  const handleEditClick = (workDay, index) => {
    setSelectedWorkDay(workDay);
    setSelectedIndex(index);
    setEditPopupOpen(true);
  };

  const handleSaveEdit = (updatedWorkDay) => {
    // Update the specific item in the workHours array using the index
    const updatedWorkHours = workHours.map((day, index) =>
      index === selectedIndex ? updatedWorkDay : day
    );
    setWorkHours(updatedWorkHours);

    // Send updated data to backend with the index (or other identifier as needed)
    fetch(`${process.env.REACT_APP_API_URL}/workHours/${selectedIndex}?userId=${userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedWorkDay),
    })
    .then(response => response.json())
    .then(data => console.log('Successfully updated:', data))
    .catch(error => console.error('Error updating work hours:', error));
    
    setEditPopupOpen(false);
  };

  const handleDeleteClick = (workDay, index) => {
    // Remove the item from the frontend state
    const updatedWorkHours = workHours.filter((_, i) => i !== index);
    setWorkHours(updatedWorkHours);
  
    // Send delete request to the backend
    fetch(`${process.env.REACT_APP_API_URL}/workHours/${index}?userId=${userId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to delete work hours');
        }
        console.log('Successfully deleted:', workDay);
      })
      .catch((error) => console.error('Error deleting work hours:', error));
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Opravljene ure</h2>

      {/* Pregled opravljanih ur */}
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Datum</th>
            <th>Število ur</th>
            <th>Nadure</th>
            <th>Urejanje</th>
          </tr>
        </thead>
        <tbody>
          {workHours.map((workDay, index) => (
            <tr key={index}>
              <td>{workDay.date}</td>
              <td>{workDay.hours}</td>
              <td>{workDay.overtime}</td>
              <td>
                <button className="btn btn-primary btn-sm me-2" onClick={() => handleEditClick(workDay, index)}>Uredi</button>
                <button className="btn btn-danger btn-sm" onClick={() => handleDeleteClick(workDay, index)}>Izbriši</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Forma za dodajanje novih delovnih ur */}
      <h4 className="mt-4">Dodaj nove delovne ure</h4>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Datum:</label>
          <input type="date" className="form-control" value={date} onChange={(e) => setDate(e.target.value)} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Število ur:</label>
          <input type="number" className="form-control" value={hoursWorked} onChange={(e) => setHoursWorked(e.target.value)} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Nadure:</label>
          <input type="number" className="form-control" value={overtime} onChange={(e) => setOvertime(e.target.value)} required />
        </div>
        <button type="submit" className="btn btn-primary">Dodaj</button>
      </form>


      {isEditPopupOpen && (
        <EditPopup
          workDay={selectedWorkDay}
          onClose={() => setEditPopupOpen(false)}
          onSave={handleSaveEdit}
        />
      )}

    </div>



  );
}

export default WorkHours;
