const mongoose = require('./config/mongoose');
const app = require('./config/express');
const { port, env } = require('./config/config');

// Open Mongo database connection
mongoose.connect();

// Listen to request
app.listen(port, () => {
  console.info(`Server started on port ${port} (${env})`);
});

module.exports = app;
