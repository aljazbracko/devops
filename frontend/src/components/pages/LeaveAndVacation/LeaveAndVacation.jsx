import React, { useEffect, useState } from 'react';
import { useAuth } from '../../../context/Context';



function LeaveAndVacation() {
  const { userId } = useAuth();

  const [leaveType, setLeaveType] = useState("Vacation");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [sickLeave, setSickLeave] = useState([]);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/sickAbsence?userId=${userId}`)
      .then((response) => {
        if (!response.ok) {
          return Promise.reject('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        setSickLeave(data.sickLeave);
      })
      .catch((error) => {
        console.error('Error fetching sick leave data:', error);
      });
  }, [userId]);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(endDate)
    const newLeave = {
      userId: userId,
      endDate: endDate,
      startDate: startDate
    };

  if (leaveType === "Sick Leave") {
    fetch(`${process.env.REACT_APP_API_URL}/sickAbsence`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newLeave),
    })
      .then((response) => response.json())
      .then((data) => {
        setSickLeave((prevSickLeave) => [...prevSickLeave, data.sickLeave]);
      })
      .catch((error) => {
        console.error('Error adding new sick leave:', error);
      });
  }

  setStartDate("");
  setEndDate("");
};

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Dopust in Bolniška</h2>

      {/* Pregled dopustov in bolniških */}
      <table className="table table-striped mb-4">
        <thead>
          <tr>
            <th>Vrsta</th>
            <th>Datum začetka</th>
            <th>Datum konca</th>
            <th>Ure</th>
            <th>Urejanje</th>
          </tr>
        </thead>
        <tbody>
          {sickLeave.map((leave, index) => (
            <tr key={index}>
              <td>Bolniška</td>
              <td>{leave.startDate}</td>
              <td>{leave.endDate}</td>
              <td>{leave.leaveHours}</td>
              <td>
                {/*<button className="btn btn-primary btn-sm me-2">Uredi</button>*/}
                <button className="btn btn-danger btn-sm">Izbriši</button>
              </td>
            </tr>
          ))}
          {/*{mockLeaves.map((leave, index) => (
            <tr key={index}>
              <td>Dopust</td>
              <td>{leave.startDate}</td>
              <td>{leave.endDate}</td>
              <td>{leave.leaveHours}</td>
              <td>
                <button className="btn btn-primary btn-sm me-2">Uredi</button>
                <button className="btn btn-danger btn-sm">Izbriši</button>
              </td>
            </tr>
          ))}*/}
        </tbody>
      </table>

      {/* Forma za dodajanje novega dopusta/bolniške */}
      <h4>Dodaj novi dopust ali bolniško</h4>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Vrsta:</label>
          <select className="form-select" value={leaveType} onChange={(e) => setLeaveType(e.target.value)}>
            <option value="Vacation">Dopust</option>
            <option value="Sick Leave">Bolniška</option>
          </select>
        </div>
        <div className="mb-3">
          <label className="form-label">Datum začetka:</label>
          <input type="date" className="form-control" value={startDate} onChange={(e) => setStartDate(e.target.value)} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Datum konca:</label>
          <input type="date" className="form-control" value={endDate} onChange={(e) => setEndDate(e.target.value)} required />
        </div>
        <button type="submit" className="btn btn-primary">Dodaj</button>
      </form>
    </div>
  );
}

export default LeaveAndVacation;
