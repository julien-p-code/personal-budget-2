const express = require('express');
const transactionsRouter = express.Router();
const transactionsControllers = require('../controllers/transactions-controller');
const httpError = require('../errors/httpError');

const {
    createTransactionController: createTransaction,
    deleteTransactionController: deleteTransaction,
    getTransactionsController: getTransactions,
    getTransactionByIdController: getTransactionById
} = transactionsControllers;

// Route to create a new transaction.
transactionsRouter.post('/', async (req, res, next) => {
    try {
        const { recipient, transactionAmount, transactionDate, envelopeId } = req.body;
        const transactionAmountNum = Number(transactionAmount);
        const envelopeIdNum = Number(envelopeId);
        const parsedDate = new Date(transactionDate);

        if (isNaN(parsedDate.getTime())) {
            throw httpError(400, 'Invalid transaction date');
        }

        if (typeof recipient !== 'string' || recipient.trim() === '') {
            throw httpError(400, 'Invalid transaction recipient');
        }

        if (!Number.isFinite(transactionAmountNum) || transactionAmountNum <= 0) {
            throw httpError(400, 'Invalid transaction amount');
        }

        if (!Number.isFinite(envelopeIdNum) || envelopeIdNum < 1) {
            throw httpError(400, 'Invalid envelope id');
        }

        const newTransaction = await createTransaction(transactionAmountNum, recipient.trim(), parsedDate, envelopeIdNum);

        return res.status(201).json({
            success: true,
            message: 'Transaction created successfully',
            transaction: newTransaction
        });
    } catch (error) {
        next(error);
    }
});

// Route to delete a transaction by ID.
transactionsRouter.delete('/:id', async (req, res, next) => {
    try {
        const id = Number(req.params.id);

        if (!Number.isFinite(id) || id < 1) {
            throw httpError(400, 'Invalid transaction id');
        }

        await deleteTransaction(id);

        return res.status(200).json({
            success: true,
            message: 'Transaction deleted successfully',
        });
    } catch (error) {
        next(error);
    }
});

// Route to get all transactions.
transactionsRouter.get('/status', async (req, res, next) => {
    try {
        return res.status(200).json({
            transactions: await getTransactions(),
        });
    } catch (error) {
        next(error);
    }
});

// Route to get a transaction by ID.
transactionsRouter.get('/:id', async (req, res, next) => {
    try {
        const id = Number(req.params.id);

        if (!Number.isFinite(id) || id < 1) {
            throw httpError(400, 'Invalid transaction id');
        }

        const transaction = await getTransactionById(id);

        if (!transaction) {
            throw httpError(404, 'Transaction not found');
        }

        return res.status(200).json({
            success: true,
            transaction
        });
    } catch (error) {
        next(error);
    }
});

module.exports = transactionsRouter;