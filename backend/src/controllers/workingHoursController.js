exports.getAllHours = async (req, res) => {
    const userId = req.query.userId;

    if (!userId) {
        return res.status(400).json({ message: 'User ID is required' });
    }

    const workHours = [
        { date: '2024-11-25', hours: 8, description: 'Regular work' },
        { date: '2024-11-26', hours: 5, description: 'Part-time work' },
    ];

    res.status(200).json({ userId, workHours });
};

exports.addHours = async (req, res) => {
    const { userId, date, hours, description } = req.body;

    if (!userId || !date || !hours) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    res.status(200).json({
        userId,
        newEntry: { date, hours, description },
        message: 'Work hours added successfully',
    });
};

exports.getHours = async (req, res) => {
    const { userId } = req.query;
    const { id } = req.params;

    if (!userId || id === undefined) {
        return res.status(400).json({ message: 'Missing required parameters' });
    }

    const workHours = [
        { date: '2024-11-25', hours: 8, description: 'Regular work' },
        { date: '2024-11-26', hours: 5, description: 'Part-time work' },
    ];

    res.status(200).json({ workHour: workHours[id] });
};

exports.updateHours = async (req, res) => {
    const { userId } = req.query;
    const { id } = req.params;
    const { description } = req.body;

    if (!userId || id === undefined || !description) {
        return res.status(400).json({ message: 'Missing required parameters' });
    }

    res.status(200).json({
        message: 'Work hours updated successfully',
        updated: { id, description },
    });
};

exports.deleteHours = async (req, res) => {
    const { userId } = req.query;
    const { id } = req.params;

    if (!userId || id === undefined) {
        return res.status(400).json({ message: 'Missing required parameters' });
    }

    res.status(200).json({ message: `Work hours with ID ${id} deleted successfully` });
};
