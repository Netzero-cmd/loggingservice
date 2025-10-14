import Log from '../modules/logModel.js';

// Function to create a log entry
export const createLog = async (req, res) => {
    try {
        const { userId, identitycode, url, method, body } = req;
        const urlParts = String(url).split('/');
        const serviceName = urlParts[1] || 'unknown';
        const actionname = urlParts[2] || 'unknown';
        const ipaddress = req.clientIp || req.ip || null;
        if (method === 'POST' && url.includes('/login')) {
            body.password = '****';
        }
        const newLog = await Log.create({ identitycode, userId, url, method, body, serviceName, actionname, ipaddress });
        return res.status(201).json(newLog);
    } catch (error) {
        return res.status(500).json({ error: 'Error creating log entry' });
    }
};
