const express = require('express');
const app = express();
const errorHandler = require('./middleware/error-handler');
const port = process.env.PORT || 3000;

// Middleware to parse JSON bodies.
app.use(express.json());

// Import budget routes.
const budgetRouter = require('./routes/budget-router');
app.use('/api/budget', budgetRouter);

// Error handling middleware.
app.use(errorHandler);

// Start the server.
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});