const httpError = require('../errors/httpError');
const { createBudget, getBudget, updateBudget } = require('../db/budget');
const {
    findAllEnvelopes,
    findEnvelopeById,
    createEnvelope,
    updateEnvelope,
    deleteEnvelope
} = require('../db/envelopes');

async function getAvailableBudgetController() {
    const totalBudget = await getBudget();
    const envelopes = await findAllEnvelopes();
    const availableBudget = envelopes.reduce((sum, env) => sum + Number(env.envelope_amount), 0);
    return Number(totalBudget.total_amount) - availableBudget;
};

//////////////////////////////////
////// Budget initialization /////
//////////////////////////////////

// Function to validate and return total and available budget.
const setTotalBudgetController = async (num) => {
    const existing = await getBudget();
    if (existing) {
        return await updateBudget(num);
    }
    return await createBudget(num);
};

//////////////////////////////////
//////// Create envelope /////////
//////////////////////////////////


// Function to create a new budget envelope.
async function createEnvelopeController(name, budget) {
    const available = await getAvailableBudgetController();
    
    // Validate budget.
    if (budget > available) {
        throw httpError(400, 'Invalid budget: budget exceeds total available budget');
    };

    // Create a new envelope object.
    return await createEnvelope(name, budget);
};

//////////////////////////////////
//////// Modify envelope /////////
//////////////////////////////////

async function updateEnvelopeController(id, updates) {
    const envelope = await findEnvelopeById(id);

    // Validate envelope existence.
    if (!envelope) {
        throw httpError(404, 'Envelope not found');
    }

    // Validate budget if amount is being updated.
    if (updates.amount !== undefined) {
        const available = await getAvailableBudgetController();
        const deltaBudget = available + Number(envelope.envelope_amount);
        if (updates.amount > deltaBudget) {
            throw httpError(400, 'Invalid amount: amount exceeds total available budget');
        }
    }

    // Update the envelope with new values, keeping existing values if not provided.
    const newAmount = updates.amount !== undefined ? updates.amount : Number(envelope.envelope_amount);
    const newName = updates.name !== undefined ? updates.name : envelope.name;

    return await updateEnvelope(id, newName, newAmount);
};

/////////////////////////////////////
///// Transfer between envelopes ////
/////////////////////////////////////

async function transferBetweenEnvelopesController(fromId, toId, amount) {
    const fromEnvelope = await findEnvelopeById(fromId);
    const toEnvelope = await findEnvelopeById(toId);

    // Validate envelopes and transfer amount.    
    if (!fromEnvelope || !toEnvelope) {
        throw httpError(404, 'One or both envelopes not found');
    }
    if (Number(fromEnvelope.envelope_amount) < amount) {
        throw httpError(400, 'Insufficient funds in the source envelope');
    }
    
    // Perform the transfer by updating both envelopes.
    const updatedFrom = await updateEnvelope(fromId, fromEnvelope.name, Number(fromEnvelope.envelope_amount) - amount);
    const updatedTo = await updateEnvelope(toId, toEnvelope.name, Number(toEnvelope.envelope_amount) + amount);
    
    return { from: updatedFrom, to: updatedTo };
};

//////////////////////////////////
//////// Delete envelope /////////
//////////////////////////////////

async function deleteEnvelopeController(id) {
    const envelope = await findEnvelopeById(id);
    if (!envelope) {
        throw httpError(404, 'Envelope not found');
    }

    return await deleteEnvelope(id);
};

///////////////////////////////////
//////////// Getters //////////////
///////////////////////////////////

async function getEnvelopesController() {
    return await findAllEnvelopes();
};

async function getTotalBudgetController() {
    return await getBudget();
};

async function getEnvelopeByIdController(id) {
    return await findEnvelopeById(id);
};

module.exports = {
    getAvailableBudgetController,
    setTotalBudgetController,
    createEnvelopeController,
    updateEnvelopeController,
    transferBetweenEnvelopesController,
    deleteEnvelopeController,
    getEnvelopesController,
    getTotalBudgetController,
    getEnvelopeByIdController
};

