const express = require('express');
const cors = require('cors');
const sequelize = require('./src/config/database'); 

const appointmentRoutes = require('./src/routes/appointmentRoutes');
const userRoutes = require('./src/routes/userRoutes');
const serviceRoutes = require('./src/routes/serviceRoutes');
const imageRegistryRoutes = require('./src/routes/imageRegistryRoutes');
const landingImageRoutes = require('./src/routes/landingImageRoutes');
const testimonyRoutes = require('./src/routes/testimonyRoutes');
const feedbackRoutes = require('./src/routes/feedbackRoutes');
const client = require('prom-client');

const app = express();
const port = process.env.PORT || 3000;

const collectDefaultMetrics = client.collectDefaultMetrics;
collectDefaultMetrics({ prefix: 'amend_api_' });

// Define a Custom Metric for Tracking Requests
const httpRequestDurationMicroseconds = new client.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'code'],
  buckets: [0.1, 0.3, 0.5, 0.7, 1, 3, 5, 10] // ranges in seconds
});

// Middleware to parse JSON bodies
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
// Track request duration and status codes
app.use((req, res, next) => {
  const end = httpRequestDurationMicroseconds.startTimer();
  res.on('finish', () => {
    const route = req.baseUrl + (req.route ? req.route.path : req.path);
    end({ 
      method: req.method, 
      route: route, 
      code: res.statusCode 
    });
  });
  next();
});

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
app.use('/feedback', feedbackRoutes);
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', client.register.contentType);
  res.end(await client.register.metrics());
});

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