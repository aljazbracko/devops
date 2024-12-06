const { addNotification, getAllNotifications } = require('../controllers/notificationController');
const { getFirestoreInstance } = require('../config/firebase');

// Mock Firebase konfiguracije
jest.mock('../config/firebase', () => ({
  getFirestoreInstance: jest.fn(),
}));

describe('Notification Controller', () => {
  let mockDb;

  beforeEach(() => {
    // Mock Firebase baze podatkov
    mockDb = {
      collection: jest.fn(() => mockDb),
      add: jest.fn(),
      get: jest.fn(() => ({
        empty: false,
        docs: [
          {
            id: '1',
            data: () => ({ notification: 'Test Notification', date: '06.12.2024' }),
          },
        ],
      })),
    };
    getFirestoreInstance.mockReturnValue(mockDb);
  });

  // Test: Dodajanje novega obvestila
  it('should add a new notification successfully', async () => {
    const req = { body: { notification: 'New Notification' } }; // Podatki za zahtevo
    const res = { status: jest.fn(() => res), json: jest.fn() }; // Mock odziv

    await addNotification(req, res);

    // Preveri, da je bil poklican `add` z ustreznimi podatki
    expect(mockDb.add).toHaveBeenCalledWith(expect.objectContaining({ notification: 'New Notification' }));

    // Preveri, da je bil status 201 (uspešno ustvarjeno)
    expect(res.status).toHaveBeenCalledWith(201);

    // Preveri, da je bil vrnjen uspešen JSON odgovor
    expect(res.json).toHaveBeenCalled();
  });

  // Test: Pridobivanje vseh obvestil
  it('should fetch all notifications successfully', async () => {
    const req = {}; // Zahteva brez parametrov
    const res = { status: jest.fn(() => res), json: jest.fn() }; // Mock odziv

    await getAllNotifications(req, res);

    // Preveri, da je bila funkcija `get` poklicana
    expect(mockDb.get).toHaveBeenCalled();

    // Preveri, da je bil status 200 (uspešno)
    expect(res.status).toHaveBeenCalledWith(200);

    // Preveri, da je bil vrnjen seznam obvestil
    expect(res.json).toHaveBeenCalled();
  });
});
