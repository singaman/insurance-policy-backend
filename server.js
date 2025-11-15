require('dotenv').config();
const express = require('express');
const cors = require('cors');
const routes = require('./routes/api');
const connectDB = require('./config/database');
const cpuMonitor = require('./services/cpuMonitor');
const requestLogger = require('./middleware/requestLogger');

const PORT = process.env.PORT || 3000;

const app = express();
app.use(cors());
app.use(requestLogger);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api', routes);
app.use(require('./middleware/errorHandler'));

connectDB();

if (!process.env.DISABLE_CPU_MONITOR) {
    cpuMonitor.start();
} else {
    console.log('CPU monitoring disabled via DISABLE_CPU_MONITOR');
}

process.on('SIGINT', () => {
    console.log('Shutting down gracefully...');
    cpuMonitor.stop();
    process.exit(0);
});

process.on('SIGTERM', () => {
    console.log('Process terminated');
    cpuMonitor.stop();
    process.exit(0);
});

app.listen(PORT, () => {
    console.log('Server running on port ' + PORT);
    console.log('CPU Monitoring active');
});
