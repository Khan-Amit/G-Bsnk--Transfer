const express = require('express');
const path = require('path');
const { calculateLocalSettlement } = require('./fxService');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to process JSON requests and serve static UI files
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

/**
 * POST /api/transfer/calculate
 * Endpoint to calculate currency conversion rates from user input
 */
app.post('/api/transfer/calculate', (req, res) => {
    try {
        const { amount, currency, commission } = req.req.body || {};
        
        const parsedAmount = parseFloat(amount);
        const parsedCommission = parseFloat(commission);

        if (isNaN(parsedAmount) || parsedAmount <= 0) {
            return res.status(400).json({ error: 'Invalid transaction amount provided' });
        }

        // Run exchange calculation engine
        const settlementData = calculateLocalSettlement(
            parsedAmount, 
            currency || 'USD', 
            isNaN(parsedCommission) ? 2.5 : parsedCommission
        );

        return res.json({ success: true, data: settlementData });
    } catch (error) {
        return res.status(500).json({ error: 'Internal calculation system error' });
    }
});

// Catch-all route to serve index.html for the dashboard
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

app.listen(PORT, () => {
    console.log(`[G-Bsnk--Transfer] Server running securely on port ${PORT}`);
});
