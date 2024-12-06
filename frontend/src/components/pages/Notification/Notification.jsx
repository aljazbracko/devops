import React, { useState, useEffect } from 'react';

function Notification({ role }) {
  const [notifications, setNotifications] = useState([]);
  const [newNotification, setNewNotification] = useState('');

  // Pridobi obvestila iz baze
  const fetchNotifications = async () => {
    try {
        const response = await fetch('http://localhost:3001/api/notifications');
        if (!response.ok) {
        throw new Error('Napaka pri pridobivanju obvestil');
      }
      const data = await response.json();
      setNotifications(data);
    } catch (error) {
      console.error('Napaka pri pridobivanju obvestil:', error);
    }
  };

  // Dodaj novo obvestilo
  const handleAddNotification = async (e) => {
    e.preventDefault();
    if (newNotification.trim() === '') {
      alert('Obvestilo ne sme biti prazno!');
      return;
    }

    try {
      const response = await fetch('http://localhost:3001/api/notifications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ notification: newNotification }),
      });
      
      if (!response.ok) {
        throw new Error('Dodajanje obvestila ni uspelo');
      }

      const result = await response.json();
      setNewNotification('');
      fetchNotifications(); // Osveži seznam obvestil po dodajanju novega
      alert(result.message); // Prikaz uspešnega sporočila
    } catch (error) {
      console.error('Napaka pri dodajanju obvestila:', error);
      alert('Dodajanje obvestila ni uspelo.');
    }
  };

  // Naloži obvestila ob prvem prikazu komponente
  useEffect(() => {
    fetchNotifications();
  }, []);

  return (
    <div className="container my-5">
      <h2 className="mb-4">Obvestila</h2>
      <div className="row">
        {/* Obrazec za dodajanje obvestil (viden samo adminu) */}
        {role === 'admin' && (
          <div className="col-md-4">
            <form onSubmit={handleAddNotification} className="mb-4">
              <div className="mb-3">
                <label htmlFor="notificationInput" className="form-label">Dodaj novo obvestilo</label>
                <textarea
                  id="notificationInput"
                  className="form-control"
                  rows="3"
                  value={newNotification}
                  onChange={(e) => setNewNotification(e.target.value)}
                  placeholder="Vnesite obvestilo"
                ></textarea>
              </div>
              <button type="submit" className="btn btn-primary">Dodaj</button>
            </form>
          </div>
        )}
        
        {/* Izpis obvestil */}
        <div className="col-md-8">
          {notifications.length > 0 ? (
            <ul className="list-group">
              {notifications.map((note) => (
                <li key={note.id} className="list-group-item">
                  <p className="mb-1">{note.notification}</p>
                  {/* Prikaz datuma iz `date` ali `datum` */}
                  <small className="text-muted">{note.date || note.datum || 'Datum ni na voljo'}</small>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-muted">Trenutno ni obvestil.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Notification;
