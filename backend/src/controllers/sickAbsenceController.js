const { getFirestoreInstance } = require('../config/firebase');
const admin = require('firebase-admin');

// Vrne vse bolniške odsotnosti uporabnika
exports.getAllSickAbsenceHours = async (req, res) => {
    const userId = req.query.userId;

    if (!userId) {
        return res.status(404).json({ message: 'User ID is required' });
    }

    try {
        let db = getFirestoreInstance();
        const userDoc = await db.collection('users').doc(userId).get();

        if (!userDoc.exists) {
            return res.status(404).json({ message: 'User not found' });
        }

        const userData = userDoc.data();
        const sickLeaves = userData.sickLeave || [];
        const sickLeaveWithHours = [];

        // Izračuna ure za vsako bolniško odsotnost
        sickLeaves.forEach((leave) => {
            const startDate = leave.startDate.toDate();
            const endDate = leave.endDate.toDate();
            const differenceInMs = endDate - startDate;
            const leaveHours = Math.round((differenceInMs / (1000 * 60 * 60 * 24)) * 8);

            sickLeaveWithHours.push({
                ...leave,
                leaveHours: leaveHours,
                startDate: startDate,
                endDate: endDate,
            });
        });

        res.status(200).json({ userId: userId, sickLeave: sickLeaveWithHours });
    } catch (error) {
        console.error('Error fetching sick absence hours:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Doda novo bolniško odsotnost uporabniku
exports.addSickAbsenceHours = async (req, res) => {
    const { userId, startDate, endDate } = req.body;

    if (!userId || !startDate || !endDate) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    try {
        let db = getFirestoreInstance();
        const userDocRef = db.collection('users').doc(userId);

        const newSickLeave = {
            startDate: admin.firestore.Timestamp.fromDate(new Date(startDate)),
            endDate: admin.firestore.Timestamp.fromDate(new Date(endDate)),
        };

        await userDocRef.update({
            sickLeave: admin.firestore.FieldValue.arrayUnion(newSickLeave),
        });

        res.status(201).json({
            message: 'Sick absence hours added successfully',
            sickLeave: {
                startDate: newSickLeave.startDate.toDate(),
                endDate: newSickLeave.endDate.toDate(),
            },
        });
    } catch (error) {
        console.error('Error adding sick absence hours:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Posodobi bolniško odsotnost za določen ID
exports.updateSickAbsenceHours = async (req, res) => {
    const id = req.params.id;

    if (id === null || id === undefined) {
        return res.status(404).json({ message: 'That hour doesn\'t exist' });
    }

    res.status(200).json({ message: `Sick absence with ID ${id} updated successfully` });
};

// Izbriše bolniško odsotnost za določen ID
exports.deleteSickAbsenceHours = async (req, res) => {
    const id = req.params.id;

    if (id === null || id === undefined) {
        return res.status(404).json({ message: 'That hour doesn\'t exist' });
    }

    res.status(200).json({ message: `Sick absence with ID ${id} deleted successfully` });
};
