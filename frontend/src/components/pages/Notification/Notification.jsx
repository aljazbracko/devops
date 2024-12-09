import React, { useState, useEffect } from 'react';

function Notification({ role }) {
  const [notifications, setNotifications] = useState([]);
  const [newNotification, setNewNotification] = useState({ name: '', description: '', priority: 'srednja' });
  const [filterPriority, setFilterPriority] = useState('vse');

  const API_URL = process.env.REACT_APP_API_URL; // Osnova za API klice

  // Pridobi obvestila iz baze
  const fetchNotifications = async () => {
    try {
      const response = await fetch(`${API_URL}/notifications`);
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
    if (newNotification.name.trim() === '' || newNotification.description.trim() === '') {
      alert('Ime in opis obvestila ne smeta biti prazna!');
      return;
    }

    try {
      const response = await fetch(`${API_URL}/notifications`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newNotification),
      });

      if (!response.ok) {
        throw new Error('Dodajanje obvestila ni uspelo');
      }

      const result = await response.json();
      setNewNotification({ name: '', description: '', priority: 'srednja' }); // Resetiraj obrazec
      fetchNotifications(); // Osveži seznam obvestil
      alert(result.message); // Prikaz uspešnega sporočila
    } catch (error) {
      console.error('Napaka pri dodajanju obvestila:', error);
      alert('Dodajanje obvestila ni uspelo.');
    }
  };

  // Filtriraj obvestila po prioriteti
  const filteredNotifications = filterPriority === 'vse'
    ? notifications
    : notifications.filter((note) => note.priority === filterPriority);

  // Naloži obvestila ob prvem prikazu komponente
  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);
  

  return (
    <div className="container my-5">
      <h2 className="mb-4">Obvestila</h2>
      <div className="row">
        {/* Levi stolpec: Obrazec za dodajanje obvestil */}
        {role === 'admin' && (
          <div className="col-md-6">
            <form onSubmit={handleAddNotification} className="mb-4">
              <div className="mb-3">
                <label htmlFor="nameInput" className="form-label">Ime obvestila</label>
                <input
                  id="nameInput"
                  type="text"
                  className="form-control"
                  value={newNotification.name}
                  onChange={(e) => setNewNotification({ ...newNotification, name: e.target.value })}
                  placeholder="Vnesite ime obvestila"
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="descriptionInput" className="form-label">Opis</label>
                <textarea
                  id="descriptionInput"
                  className="form-control"
                  rows="3"
                  value={newNotification.description}
                  onChange={(e) => setNewNotification({ ...newNotification, description: e.target.value })}
                  placeholder="Vnesite opis obvestila"
                  required
                ></textarea>
              </div>
              <div className="mb-3">
                <label htmlFor="priorityInput" className="form-label">Prioriteta:</label>
                <select
                  id="priorityInput"
                  className="form-select"
                  value={newNotification.priority}
                  onChange={(e) => setNewNotification({ ...newNotification, priority: e.target.value })}
                >
                  <option value="nizka">Nizka</option>
                  <option value="srednja">Srednja</option>
                  <option value="visoka">Visoka</option>
                </select>
              </div>
              <button type="submit" className="btn btn-primary">Dodaj</button>
            </form>
          </div>
        )}

        {/* Desni stolpec: Filter in prikaz obvestil */}
        <div className="col-md-6">
          <div className="mb-3">
            <label htmlFor="filterPriority" className="form-label">Filtriraj po prioriteti:</label>
            <select
              id="filterPriority"
              className="form-select"
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
            >
              <option value="vse">Vse</option>
              <option value="nizka">Nizka</option>
              <option value="srednja">Srednja</option>
              <option value="visoka">Visoka</option>
            </select>
          </div>
          {filteredNotifications.length > 0 ? (
            <ul className="list-group">
              {filteredNotifications.map((note) => (
                <li
                  key={note.id}
                  className="list-group-item"
                  style={{
                    backgroundColor:
                      note.priority === 'visoka' ? '#ffcccc' :
                        note.priority === 'srednja' ? '#ffe6b3' :
                          '#ccffcc',
                  }}
                >
                  <p className="mb-1"><strong>{note.name}</strong></p>
                  <p>{note.description}</p>
                  <small className="text-muted">
                    {note.date || 'Datum ni na voljo'} - Prioriteta: {note.priority}
                  </small>
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
