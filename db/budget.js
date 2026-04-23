const pool = require('./index');

async function createBudget(totalAmount) {
    const query = 'INSERT INTO budget (id, total_amount) VALUES (1,$1) RETURNING *';
    const { rows } = await pool.query(query, [totalAmount]);
    return rows[0];
}

async function getBudget() {
    const query = 'SELECT * FROM budget WHERE id = 1';
    const { rows } = await pool.query(query);
    return rows[0];
}

async function updateBudget(totalAmount) {
    const query = 'UPDATE budget SET total_amount = $1 WHERE id = 1 RETURNING *';
    const { rows } = await pool.query(query, [totalAmount]);
    return rows[0];
}

module.exports = {
    createBudget,
    getBudget,
    updateBudget
};
