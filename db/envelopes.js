const pool = require('./index');

async function findAllEnvelopes() {
    const query = 'SELECT * FROM envelopes';
    const { rows } = await pool.query(query);
    return rows;
}

async function findEnvelopeById(id) {
    const query = 'SELECT * FROM envelopes WHERE id = $1';
    const { rows } = await pool.query(query, [id]);
    return rows[0];
}

async function createEnvelope(name, amount) {
    const query = 'INSERT INTO envelopes (name, envelope_amount) VALUES ($1, $2) RETURNING *';
    const { rows } = await pool.query(query, [name, amount]);
    return rows[0];
}

async function updateEnvelope(id, name, amount) {
    const query = 'UPDATE envelopes SET name = $1, envelope_amount = $2 WHERE id = $3 RETURNING *';
    const { rows } = await pool.query(query, [name, amount, id]);
    return rows[0];
}

async function deleteEnvelope(id) {
    const query = 'DELETE FROM envelopes WHERE id = $1 RETURNING *';
    const { rows } = await pool.query(query, [id]);
    return rows[0];
}

async function transferBetweenEnvelopes(fromId, toId, amount) {
    const fromEnvelope = await findEnvelopeById(fromId);
    const toEnvelope = await findEnvelopeById(toId);
    
    if (!fromEnvelope || !toEnvelope) {
        throw new Error('One or both envelopes not found');
    }
    if (fromEnvelope.envelope_amount < amount) {
        throw new Error('Insufficient funds in the source envelope');
    }
    
    const updatedFrom = await updateEnvelope(fromId, fromEnvelope.name, Number(fromEnvelope.envelope_amount) - amount);
    const updatedTo = await updateEnvelope(toId, toEnvelope.name, Number(toEnvelope.envelope_amount) + amount);
    
    return { from: updatedFrom, to: updatedTo };
}

module.exports = {
    findAllEnvelopes,
    findEnvelopeById,
    createEnvelope,
    updateEnvelope,
    deleteEnvelope,
    transferBetweenEnvelopes
};