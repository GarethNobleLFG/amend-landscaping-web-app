const express = require('express');
const sequelize = require('./config/database'); 
const appointmentRoutes = require('./routes/appointmentRoutes');

const app = express();
const port = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Basic test route
app.get('/', (req, res) => {
  res.send('Amend Landscaping API is running!');
});
app.use('/appointments', appointmentRoutes);

// Initialize database and start the server
async function startServer() {
  try {
    // Test the database connection
    await sequelize.authenticate();
    console.log('Database connection has been established successfully.');

    // Start the server only if the database connects
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } 
  catch (error) {
    console.error('Unable to connect to the database:', error);
  }
}

startServer();