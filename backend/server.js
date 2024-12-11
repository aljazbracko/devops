const express = require('express');
const cors = require('cors');
require('dotenv').config(); // Dodano za branje .env

const { initializeFirestore } = require('./src/config/firebase.js');
const authRoutes = require('./src/routes/authenticationRoutes.js');
const workHoursRoutes = require('./src/routes/workingHoursRoutes.js');
const sickAbsenceRoutes = require('./src/routes/sickAbsenceRoutes.js');
const vacationAbsenceRoutes = require('./src/routes/vacationAbsenceRoutes.js');
const notificationRoutes = require('./src/routes/notificationRoutes');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(
  cors()
);
app.use(express.json());

initializeFirestore();

app.use('/auth', authRoutes);
app.use('/workHours', workHoursRoutes);
app.use('/sickAbsence', sickAbsenceRoutes);
app.use('/vacationAbsence', vacationAbsenceRoutes);
app.use('/notifications', notificationRoutes);

// Add the root route here
app.get('/', (req, res) => {
  res.status(200).send('Backend is running!');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
