const { getFirestoreInstance } = require('../config/firebase');
const admin = require('firebase-admin');

exports.addNotification = async (req, res) => {
  const { name, description, priority } = req.body;

  if (!name || !description || !priority) {
    return res.status(400).json({ message: 'All fields (name, description, priority) are required' });
  }

  try {
    const db = getFirestoreInstance();

    // Ustvari datum v obliki "dd.mm.yyyy"
    const today = new Date();
    const formattedDate = `${today.getDate().toString().padStart(2, '0')}.${(today.getMonth() + 1)
      .toString()
      .padStart(2, '0')}.${today.getFullYear()}`;

    const newNotification = {
      name,
      description,
      priority,
      date: formattedDate, // Datum kot niz
    };

    const docRef = await db.collection('notification').add(newNotification);

    res.status(201).json({
      message: 'Notification added successfully',
      notification: {
        id: docRef.id,
        ...newNotification,
      },
    });
  } catch (error) {
    console.error('Error adding notification:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.getAllNotifications = async (req, res) => {
    try {
        const db = getFirestoreInstance();
        const snapshot = await db.collection('notification').get();

        if (snapshot.empty) {
            return res.status(404).json({ message: 'Ni najdenih obvestil' });
        }

        const notifications = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));

        res.status(200).json(notifications);
    } catch (error) {
        console.error('Napaka pri pridobivanju obvestil:', error);
        res.status(500).json({ message: 'Napaka na strežniku' });
    }
};
