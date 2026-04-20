const httpError = require('../errors/httpError');

let envelopes = [];

let envelopeIdCounter = 1;

let totalBudget = 0;
let availableBudget = 0;

//////////////////////////////////
////// Budget initialization /////
//////////////////////////////////

// Function to validate and return total and available budget.
const setTotalBudget = (num) => {
    if (!Number.isFinite(num) || num < 0) {
        throw httpError(400, 'Invalid budget: budget must be a non-negative number');
    } else {
        totalBudget = num;
        availableBudget = num;
    }
};

//////////////////////////////////
//////// Create envelope /////////
//////////////////////////////////


// Function to create a new budget envelope.
function createEnvelope(name, budget) {
    if (typeof name !== 'string' || typeof budget !== 'number' || budget < 0) {
        throw httpError(400, 'Invalid input: expected a string for name and a non-negative number for budget');
    };

    if (budget > availableBudget) {
        throw httpError(400, 'Invalid budget: budget exceeds total available budget');
    };

    // Update available budget.
    availableBudget -= budget;

    // Create a new envelope object.
    const envelope = {
        id: envelopeIdCounter++,
        name: name,
        budget: budget
    };

    // Add the new envelope to the envelopes array.
    envelopes.push(envelope);

    return envelope;
};

//////////////////////////////////
//////// Modify envelope /////////
//////////////////////////////////

function modifyEnvelope(id, newName, newBudget) {
    if (!Number.isFinite(id) || id < 0) {
        throw httpError(400, 'Invalid envelope id');
    }

    // Find the existing envelope once
    const envelope = envelopes.find(env => env.id === id);
    if (!envelope) {
        throw httpError(404, 'Envelope not found');
    }

    if (!Number.isFinite(newBudget) || newBudget < 0) {
        throw httpError(400, 'Invalid budget amount');
    }

    // Money available for THIS envelope = availableBudget + current envelope budget
    const deltaBudget = availableBudget + envelope.budget;

    if (newBudget > deltaBudget) {
        throw httpError(400, 'Invalid budget: budget exceeds total available budget');
    }

    // Update available budget after reallocating
    availableBudget = deltaBudget - newBudget;

    // Mutate the existing envelope.
    envelope.name = newName;
    envelope.budget = newBudget;

    return envelope;
};

function transferBetweenEnvelopes(fromId, toId, amount) {
    if (!Number.isFinite(fromId) || fromId < 0 || !Number.isFinite(toId) || toId < 0) {
        throw httpError(400, 'Invalid envelope id');
    }

    if (!Number.isFinite(amount) || amount <= 0) {
        throw httpError(400, 'Invalid transfer amount');
    }

    const fromEnvelope = envelopes.find(env => env.id === fromId);
    const toEnvelope = envelopes.find(env => env.id === toId);

    if (!fromEnvelope) {
        throw httpError(404, 'Source envelope not found');
    }
    if (!toEnvelope) {
        throw httpError(404, 'Target envelope not found');
    }

    if (fromEnvelope.budget < amount) {
        throw httpError(400, 'Insufficient funds in the source envelope');
    }
    fromEnvelope.budget -= amount;
    toEnvelope.budget += amount;

    return {
        fromEnvelope,
        toEnvelope
    };
}

//////////////////////////////////
//////// Delete envelope /////////
//////////////////////////////////

function deleteEnvelope(id) {
    if (!Number.isFinite(id) || id < 0) {
        throw httpError(400, 'Invalid envelope id');
    }

    const envelopeIndex = envelopes.findIndex(env => env.id === id);
    if (envelopeIndex === -1) {
        throw httpError(404, 'Envelope not found');
    }

    const deletedEnvelope = envelopes[envelopeIndex];

    // Restore its budget
    availableBudget += deletedEnvelope.budget;

    // Remove it
    envelopes.splice(envelopeIndex, 1);

    return deletedEnvelope;
};

///////////////////////////////////
//////////// Getters //////////////
///////////////////////////////////

function getEnvelopes() {
    return envelopes;
};

function getAvailableBudget() {
    return availableBudget;
};

function getTotalBudget() {
    return totalBudget;
};

module.exports = {
    transferBetweenEnvelopes,
    getEnvelopes,
    getAvailableBudget,
    getTotalBudget,
    setTotalBudget,
    createEnvelope,
    modifyEnvelope,
    deleteEnvelope,
};

