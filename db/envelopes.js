const pool = require('./index');

async function findAllEnvelopes() {
    const query = 'SELECT * FROM envelopes';
    const { rows } = await pool.query(query);
    return rows;
};

async function findEnvelopeById(id) {
    const query = 'SELECT * FROM envelopes WHERE id = $1';
    const { rows } = await pool.query(query, [id]);
    return rows[0];
};

async function createEnvelope(name, amount) {
    const query = 'INSERT INTO envelopes (name, envelope_amount) VALUES ($1, $2) RETURNING *';
    const { rows } = await pool.query(query, [name, amount]);
    return rows[0];
};

async function updateEnvelope(id, name, amount) {
    const query = 'UPDATE envelopes SET name = $1, envelope_amount = $2 WHERE id = $3 RETURNING *';
    const { rows } = await pool.query(query, [name, amount, id]);
    return rows[0];
};

async function deleteEnvelope(id) {
    const query = 'DELETE FROM envelopes WHERE id = $1 RETURNING *';
    const { rows } = await pool.query(query, [id]);
    return rows[0];
};

module.exports = {
    findAllEnvelopes,
    findEnvelopeById,
    createEnvelope,
    updateEnvelope,
    deleteEnvelope,
};