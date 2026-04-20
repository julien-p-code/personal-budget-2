const express = require('express');
const budgetRouter = express.Router();
const budgetControllers = require('../controllers/budget-controller');

const {
    transferBetweenEnvelopes,
    getEnvelopes,
    getAvailableBudget,
    getTotalBudget,
    setTotalBudget,
    createEnvelope,
    modifyEnvelope,
    deleteEnvelope,
} = budgetControllers;

// Route to initialize total budget.
budgetRouter.post('/init', (req, res) => {
    const { totalBudget: initBudget } = req.body;
    const totalBudgetNum = Number(initBudget);

    if (!Number.isFinite(totalBudgetNum) || totalBudgetNum < 0) {
        return res.status(400).json({
            success: false,
            message: 'Invalid total budget value'
        });
    }

    setTotalBudget(totalBudgetNum);

    return res.status(200).json({
        success: true,
        message: 'Budget initialized successfully',
        totalBudget: getTotalBudget(),
        availableBudget: getAvailableBudget(),
    });
});

// Route to create a new envelope.
budgetRouter.post('/envelopes', (req, res) => {
    const { name, allocatedAmount } = req.body;
    const allocatedAmountNum = Number(allocatedAmount);

    if (typeof name !== 'string' || name.trim() === '' ||
        !Number.isFinite(allocatedAmountNum) || allocatedAmountNum < 0) {
        return res.status(400).json({
            success: false,
            message: 'Invalid envelope data'
        });
    }

    const newEnvelope = createEnvelope(name.trim(), allocatedAmountNum);

    return res.status(201).json({
        success: true,
        message: 'Envelope created successfully',
        envelope: newEnvelope,
        availableBudget: getAvailableBudget(),
    });
});

// Route to transfer budget between envelopes.
budgetRouter.post('/envelopes/transfer', (req, res) => {
    const { fromEnvelopeId, toEnvelopeId, amount } = req.body;
    const fromIdNum = Number(fromEnvelopeId);
    const toIdNum = Number(toEnvelopeId);
    const amountNum = Number(amount);

    if (!Number.isFinite(fromIdNum) || fromIdNum < 0) {
        return res.status(400).json({
            success: false,
            message: 'Invalid source envelope id'
        });
    };

    if (!Number.isFinite(toIdNum) || toIdNum < 0) {
        return res.status(400).json({
            success: false,
            message: 'Invalid target envelope id'
        });
    };
    
    if (!Number.isFinite(amountNum) || amountNum <= 0) {
        return res.status(400).json({
            success: false,
            message: 'Invalid transfer amount'
        });
    }

    const { fromEnvelope, toEnvelope } = transferBetweenEnvelopes(fromIdNum, toIdNum, amountNum);

    return res.status(200).json({
        success: true,
        message: 'Transfer completed successfully',
        fromEnvelope,
        toEnvelope,
        availableBudget: getAvailableBudget(),
    });
});

// Route to modify an existing envelope.
budgetRouter.put('/envelopes/:id', (req, res) => {
    const id = Number(req.params.id);
    const { name, allocatedAmount } = req.body;
    const allocatedAmountNum = Number(allocatedAmount);

    if (!Number.isFinite(id) || id < 0) {
        return res.status(400).json({
            success: false,
            message: 'Invalid envelope id'
        });
    }

    if (typeof name !== 'string' || name.trim() === '' ||
        !Number.isFinite(allocatedAmountNum) || allocatedAmountNum < 0) {
        return res.status(400).json({
            success: false,
            message: 'Invalid envelope data'
        });
    }

    const updatedEnvelope = modifyEnvelope(id, name.trim(), allocatedAmountNum);

    return res.status(200).json({
        success: true,
        message: 'Envelope updated successfully',
        envelope: updatedEnvelope,
        availableBudget: getAvailableBudget(),
    });
});

budgetRouter.delete('/envelopes/:id', (req, res) => {
    const id = Number(req.params.id);

    if (!Number.isFinite(id) || id < 0) {
        return res.status(400).json({
            success: false,
            message: 'Invalid envelope id'
        });
    }

    deleteEnvelope(id);

    return res.status(204).send();
});

// Route to get all envelopes.
budgetRouter.get('/status', (req, res) => {
    return res.status(200).json({
        envelopes: getEnvelopes(),
        availableBudget: getAvailableBudget(),
        totalBudget: getTotalBudget(),
    });
});

budgetRouter.get('/envelopes', (req, res) => {
    return res.status(200).json({
        success: true,
        envelopes: getEnvelopes(),
    });
});

// Route to get an envelope by ID.
budgetRouter.get('/envelopes/:id', (req, res) => {
    const id = Number(req.params.id);

    if (!Number.isFinite(id) || id < 0) {
        return res.status(400).json({
            success: false,
            message: 'Invalid envelope id'
        });
    }

    const envelope = getEnvelopes().find(env => env.id === id);

    if (!envelope) {
        return res.status(404).json({
            success: false,
            message: 'Envelope not found'
        });
    }

    return res.status(200).json({
        success: true,
        envelope
    });
});

module.exports = budgetRouter;