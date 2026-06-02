const express = require('express');
const cors = require('cors');
const sequelize = require('./src/config/database'); 

const appointmentRoutes = require('./src/routes/appointmentRoutes');
const userRoutes = require('./src/routes/userRoutes');
const serviceRoutes = require('./src/routes/serviceRoutes');
const imageRegistryRoutes = require('./src/routes/imageRegistryRoutes');
const landingImageRoutes = require('./src/routes/landingImageRoutes');
const testimonyRoutes = require('./src/routes/testimonyRoutes');

const app = express();
const port = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Basic test route
app.get('/', (req, res) => {
  res.send('Amend Landscaping API is running!');
});

app.use('/appointments', appointmentRoutes);
app.use('/users', userRoutes);
app.use('/services', serviceRoutes);
app.use('/images', imageRegistryRoutes);
app.use('/landing-images', landingImageRoutes);
app.use('/testimonies', testimonyRoutes);

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