const {
    getAllHours,
    addHours,
    getHours,
    updateHours,
    deleteHours,
} = require('./workingHoursController');

describe('Working Hours Controller', () => {
    // preveri vračanje vseh delovnih ur
    it('should return all working hours for a user', async () => {
        const mockReq = { query: { userId: 'testUser' } };
        const mockRes = { status: jest.fn().mockReturnThis(), json: jest.fn() };

        await getAllHours(mockReq, mockRes);

        expect(mockRes.status).toHaveBeenCalledWith(200);
        expect(mockRes.json).toHaveBeenCalledWith({
            userId: 'testUser',
            workHours: expect.any(Array),
        });
    });

    // preveri dodajanje novih delovnih ur
    it('should add new work hours for a user', async () => {
        const mockReq = {
            body: { userId: 'testUser', date: '2024-11-25', hours: 8, description: 'Regular work' },
        };
        const mockRes = { status: jest.fn().mockReturnThis(), json: jest.fn() };

        await addHours(mockReq, mockRes);

        expect(mockRes.status).toHaveBeenCalledWith(200);
        expect(mockRes.json).toHaveBeenCalledWith(
            expect.objectContaining({
                message: 'Work hours added successfully',
                newEntry: expect.objectContaining({
                    date: '2024-11-25',
                    hours: 8,
                    description: 'Regular work',
                }),
            })
        );
    });

    // preveri vračanje specifičnih delovnih ur
    it('should return specific work hour for a given ID', async () => {
        const mockReq = { query: { userId: 'testUser' }, params: { id: 0 } };
        const mockRes = { status: jest.fn().mockReturnThis(), json: jest.fn() };

        await getHours(mockReq, mockRes);

        expect(mockRes.status).toHaveBeenCalledWith(200);
        expect(mockRes.json).toHaveBeenCalledWith({
            workHour: expect.objectContaining({
                date: expect.any(String),
                hours: expect.any(Number),
                description: expect.any(String),
            }),
        });
    });

    // preveri posodobitev delovnih ur
    it('should update a specific work hour successfully', async () => {
        const mockReq = { query: { userId: 'testUser' }, params: { id: 1 }, body: { description: 'Updated work' } };
        const mockRes = { status: jest.fn().mockReturnThis(), json: jest.fn() };

        await updateHours(mockReq, mockRes);

        expect(mockRes.status).toHaveBeenCalledWith(200);
        expect(mockRes.json).toHaveBeenCalledWith(
            expect.objectContaining({
                message: 'Work hours updated successfully',
                updated: expect.objectContaining({
                    id: 1,
                    description: 'Updated work',
                }),
            })
        );
    });

    // preveri brisanje delovnih ur
    it('should delete a specific work hour successfully', async () => {
        const mockReq = { query: { userId: 'testUser' }, params: { id: 1 } };
        const mockRes = { status: jest.fn().mockReturnThis(), json: jest.fn() };

        await deleteHours(mockReq, mockRes);

        expect(mockRes.status).toHaveBeenCalledWith(200);
        expect(mockRes.json).toHaveBeenCalledWith({
            message: 'Work hours with ID 1 deleted successfully',
        });
    });

    // preveri manjkajoče parametre za dodajanje delovnih ur
    it('should return error if required fields are missing in addHours', async () => {
        const mockReq = { body: { userId: 'testUser', hours: 8 } }; // Manjka `date`
        const mockRes = { status: jest.fn().mockReturnThis(), json: jest.fn() };

        await addHours(mockReq, mockRes);

        expect(mockRes.status).toHaveBeenCalledWith(400);
        expect(mockRes.json).toHaveBeenCalledWith({
            message: 'Missing required fields',
        });
    });
});
