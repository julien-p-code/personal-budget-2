const httpError = require('../errors/httpError');
const { findEnvelopeById, updateEnvelope } = require('../db/envelopes');
const {
    findAllTransactions,
    findTransactionById,
    createTransaction,
    deleteTransaction
} = require('../db/transactions');


//////////////////////////////////
/////// Create transaction ///////
//////////////////////////////////

// Function to create a new budget envelope.
async function createTransactionController(amount, recipient, date, envelopeId) {
    const envelope = await findEnvelopeById(envelopeId);

    // Validate envelope existence.
    if (!envelope) {
        throw httpError(404, 'Envelope not found');
    }
    
    // Validate transaction amount.
    if (amount > Number(envelope.envelope_amount)) {
        throw httpError(400, 'Insufficient funds in the selected envelope');
    };

    // Update the envelope to reflect the new transaction.
    await updateEnvelope(envelopeId, envelope.name, Number(envelope.envelope_amount) - amount);

    // Create a new transaction object.
    return await createTransaction(amount, recipient, date, envelopeId);
};

//////////////////////////////////
/////// Delete transaction ///////
//////////////////////////////////

async function deleteTransactionController(id) {
    const transaction = await findTransactionById(id);
    if (!transaction) {
        throw httpError(404, 'Transaction not found');
    }

    const envelope = await findEnvelopeById(transaction.id_envelope);
    if (!envelope) {
        throw httpError(404, 'Associated envelope not found');
    }

    // Update the envelope to reflect the deleted transaction.
    const updatedEnvelope = Number(envelope.envelope_amount) + Number(transaction.payment_amount);
    await updateEnvelope(envelope.id, envelope.name, updatedEnvelope);

    return await deleteTransaction(id);
};

///////////////////////////////////
//////////// Getters //////////////
///////////////////////////////////

async function getTransactionsController() {
    return await findAllTransactions();
};

async function getTransactionByIdController(id) {
    return await findTransactionById(id);
};

module.exports = {
    createTransactionController,
    deleteTransactionController,
    getTransactionsController,
    getTransactionByIdController
};

