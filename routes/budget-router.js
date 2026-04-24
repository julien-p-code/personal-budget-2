const express = require('express');
const budgetRouter = express.Router();
const budgetControllers = require('../controllers/budget-controller');
const httpError = require('../errors/httpError');

const {
    setTotalBudgetController: setTotalBudget,
    createEnvelopeController: createEnvelope,
    updateEnvelopeController: modifyEnvelope,
    getAvailableBudgetController: getAvailableBudget,
    getTotalBudgetController: getTotalBudget,
    getEnvelopesController: getEnvelopes,
    transferBetweenEnvelopesController: transferBetweenEnvelopes,
    deleteEnvelopeController: deleteEnvelope,
    getEnvelopeByIdController: getEnvelopeById
} = budgetControllers;

// Route to initialize total budget.
budgetRouter.post('/init', async (req, res, next) => {
    try {
        const { totalBudget: initBudget } = req.body;
        const totalBudgetNum = Number(initBudget);

        if (!Number.isFinite(totalBudgetNum) || totalBudgetNum < 0) {
            throw httpError(400, 'Invalid total budget amount');
        }

        return res.status(200).json({
            success: true,
            message: 'Budget initialized successfully',
            totalBudget: await setTotalBudget(totalBudgetNum),
            availableBudget: await getAvailableBudget()
        })
    } catch (error) {
        next(error);
    }
});

// Route to create a new envelope.
budgetRouter.post('/envelopes', async (req, res, next) => {
    try {
        const { name, allocatedAmount } = req.body;
        const allocatedAmountNum = Number(allocatedAmount);

        if (typeof name !== 'string' || name.trim() === '' ||
            !Number.isFinite(allocatedAmountNum) || allocatedAmountNum < 0) {
            throw httpError(400, 'Invalid envelope data');
        }

        const newEnvelope = await createEnvelope(name.trim(), allocatedAmountNum);

        return res.status(201).json({
            success: true,
            message: 'Envelope created successfully',
            envelope: newEnvelope,
            availableBudget: await getAvailableBudget()
        });
    } catch (error) {
        next(error);
    }
});

// Route to transfer budget between envelopes.
budgetRouter.post('/envelopes/transfer', async (req, res, next) => {
    try {

        const { fromEnvelopeId, toEnvelopeId, amount } = req.body;
        const fromIdNum = Number(fromEnvelopeId);
        const toIdNum = Number(toEnvelopeId);
        const amountNum = Number(amount);

        if (!Number.isFinite(fromIdNum) || fromIdNum < 1) {
            throw httpError(400, 'Invalid source envelope id');
        };

        if (!Number.isFinite(toIdNum) || toIdNum < 1) {
            throw httpError(400, 'Invalid target envelope id');
        };

        if (!Number.isFinite(amountNum) || amountNum <= 0) {
            throw httpError(400, 'Invalid transfer amount');
        }

        const { from: fromEnvelope, to: toEnvelope } = await transferBetweenEnvelopes(fromIdNum, toIdNum, amountNum);

        return res.status(200).json({
            success: true,
            message: 'Transfer completed successfully',
            fromEnvelope,
            toEnvelope,
            availableBudget: await getAvailableBudget()
        });
    } catch (error) {
        next(error);
    }
});

// Route to modify an existing envelope.
budgetRouter.put('/envelopes/:id', async (req, res, next) => {
    try {
        const id = Number(req.params.id);
        const updates = req.body;

        if (!Number.isFinite(id) || id < 1) {
            throw httpError(400, 'Invalid envelope id');
        }

        if (updates.name !== undefined) {
            if (typeof updates.name !== 'string' || updates.name.trim() === '') {
                throw httpError(400, 'Invalid envelope name');
            }
        }

        if (updates.amount !== undefined) {
            if (!Number.isFinite(updates.amount) || updates.amount < 0) {
                throw httpError(400, 'Invalid envelope amount');
            }
        }

        const updatedEnvelope = await modifyEnvelope(id, updates);

        return res.status(200).json({
            success: true,
            message: 'Envelope updated successfully',
            envelope: updatedEnvelope,
            availableBudget: await getAvailableBudget()
        });
    } catch (error) {
        next(error);
    }
});

budgetRouter.delete('/envelopes/:id', async (req, res, next) => {
    try {

        const id = Number(req.params.id);

        if (!Number.isFinite(id) || id < 1) {
            throw httpError(400, 'Invalid envelope id');
        }

        await deleteEnvelope(id);

        return res.status(200).json({
            success: true,
            message: 'Envelope deleted successfully',
            availableBudget: await getAvailableBudget()
        });
    } catch (error) {
        next(error);
    }
});

// Route to get all envelopes.
budgetRouter.get('/status', async (req, res, next) => {
    try {
        return res.status(200).json({
            envelopes: await getEnvelopes(),
            availableBudget: await getAvailableBudget(),
            totalBudget: await getTotalBudget(),
        });
    } catch (error) {
        next(error);
    }
});

budgetRouter.get('/envelopes', async (req, res, next) => {
    try {
        return res.status(200).json({
            success: true,
            envelopes: await getEnvelopes(),
        });
    } catch (error) {
        next(error);
    }
});

// Route to get an envelope by ID.
budgetRouter.get('/envelopes/:id', async (req, res, next) => {
    try {
        const id = Number(req.params.id);

        if (!Number.isFinite(id) || id < 1) {
            throw httpError(400, 'Invalid envelope id');
        }

        const envelope = await getEnvelopeById(id);

        if (!envelope) {
            throw httpError(404, 'Envelope not found');
        }

        return res.status(200).json({
            success: true,
            envelope
        });
    } catch (error) {
        next(error);
    }
});

module.exports = budgetRouter;