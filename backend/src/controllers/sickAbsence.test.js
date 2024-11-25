const {
    getAllSickAbsenceHours,
    addSickAbsenceHours,
    updateSickAbsenceHours,
    deleteSickAbsenceHours,
} = require('./sickAbsenceController');

jest.mock('../config/firebase', () => ({
    getFirestoreInstance: jest.fn(() => ({
        collection: jest.fn(() => ({
            doc: jest.fn(() => ({
                get: jest.fn(() => ({
                    exists: true,
                    data: jest.fn(() => ({
                        sickLeave: [
                            { startDate: { toDate: () => new Date('2024-11-20') }, endDate: { toDate: () => new Date('2024-11-25') } },
                        ],
                    })),
                })),
                update: jest.fn(),
            })),
        })),
    })),
}));

describe('Sick Absence Controller', () => {
    // preveri vračanje vseh bolniških odsotnosti
    it('should return all sick absences for a user', async () => {
        const mockReq = { query: { userId: 'testUser' } };
        const mockRes = { status: jest.fn().mockReturnThis(), json: jest.fn() };

        await getAllSickAbsenceHours(mockReq, mockRes);

        expect(mockRes.status).toHaveBeenCalledWith(200);
        expect(mockRes.json).toHaveBeenCalledWith({
            userId: 'testUser',
            sickLeave: expect.any(Array),
        });
    });

    // preveri dodajanje bolniške odsotnosti
    it('should add a sick absence for a user', async () => {
        const mockReq = { body: { userId: 'testUser', startDate: '2024-11-20', endDate: '2024-11-25' } };
        const mockRes = { status: jest.fn().mockReturnThis(), json: jest.fn() };

        await addSickAbsenceHours(mockReq, mockRes);

        expect(mockRes.status).toHaveBeenCalledWith(201);
        expect(mockRes.json).toHaveBeenCalledWith(
            expect.objectContaining({ message: 'Sick absence hours added successfully' })
        );
    });

    // preveri posodobitev bolniške odsotnosti
    it('should return error when updating sick absence if ID is invalid', async () => {
        const mockReq = { params: { id: null } };
        const mockRes = { status: jest.fn().mockReturnThis(), json: jest.fn() };

        await updateSickAbsenceHours(mockReq, mockRes);

        expect(mockRes.status).toHaveBeenCalledWith(404);
        expect(mockRes.json).toHaveBeenCalledWith({
            message: "That hour doesn't exist",
        });
    });

    // preveri brisanje bolniške odsotnosti
    it('should return error when deleting sick absence if ID is invalid', async () => {
        const mockReq = { params: { id: null } };
        const mockRes = { status: jest.fn().mockReturnThis(), json: jest.fn() };

        await deleteSickAbsenceHours(mockReq, mockRes);

        expect(mockRes.status).toHaveBeenCalledWith(404);
        expect(mockRes.json).toHaveBeenCalledWith({
            message: "That hour doesn't exist",
        });
    });

    // preveri, ali bolniška odsotnost obstaja
    it('should handle missing user ID gracefully', async () => {
        const mockReq = { query: {} };
        const mockRes = { status: jest.fn().mockReturnThis(), json: jest.fn() };

        await getAllSickAbsenceHours(mockReq, mockRes);

        expect(mockRes.status).toHaveBeenCalledWith(404);
    });
});
