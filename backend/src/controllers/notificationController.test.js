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
            data: () => ({ name: 'Test Notification', description: 'Test Description', priority: 'srednja', date: '06.12.2024' }),
          },
        ],
      })),
    };
    getFirestoreInstance.mockReturnValue(mockDb);
  });

  // Test: Validacija vhodnih podatkov pri dodajanju obvestila
  it('should return 400 if required fields are missing', async () => {
    const req = { body: { name: '' } }; // Manjkajoči podatki
    const res = { status: jest.fn(() => res), json: jest.fn() }; // Mock odziv

    await addNotification(req, res);

    // Preveri, da je bil status 400 (slaba zahteva)
    expect(res.status).toHaveBeenCalledWith(400);

    // Preveri, da je bil vrnjen ustrezen JSON odgovor
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: 'All fields (name, description, priority) are required' }));
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
