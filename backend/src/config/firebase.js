const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
require('dotenv').config();

let db;

function initializeFirestore() {
    if (!db) {
        const serviceAccount = {
            projectId: process.env.FIREBASE_PROJECT_ID,
            privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        };
        initializeApp({
            credential: cert(serviceAccount),
        });
        db = getFirestore();
    }
}

function getFirestoreInstance() {
    return db;
}

module.exports = { initializeFirestore, getFirestoreInstance };
