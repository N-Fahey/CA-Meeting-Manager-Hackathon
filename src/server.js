const mongoose = require('mongoose');
const { app } = require('./index.js');

const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || '0.0.0.0';
const MONGO_URI =
    process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/task_scheduler';

mongoose.connect(MONGO_URI)
.then(() => {
    console.log('Database connection established');
    app.listen(PORT, HOST, () => {
        console.log(`Server running on ${HOST}:${PORT}`);
    });
})
.catch((err) => {
    console.log(`Failed to connect to MongoDB: ${err}`);
});