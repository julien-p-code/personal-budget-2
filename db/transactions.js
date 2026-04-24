const pool = require('./index');

async function findAllTransactions() {
    const query = 'SELECT * FROM transactions';
    const { rows } = await pool.query(query);
    return rows;
};

async function findTransactionById(id) {
    const query = 'SELECT * FROM transactions WHERE id = $1';
    const { rows } = await pool.query(query, [id]);
    return rows[0];
};

async function createTransaction(amount, recipient, date, envelopeId) {
    const query = 'INSERT INTO transactions (payment_amount, payment_recipient, payment_date, id_envelope) VALUES ($1, $2, $3, $4) RETURNING *';
    const { rows } = await pool.query(query, [amount, recipient, date, envelopeId]);
    return rows[0];
};

async function deleteTransaction(id) {
    const query = 'DELETE FROM transactions WHERE id = $1 RETURNING *';
    const { rows } = await pool.query(query, [id]);
    return rows[0];
};

module.exports = {
    findAllTransactions,
    findTransactionById,
    createTransaction,
    deleteTransaction
};