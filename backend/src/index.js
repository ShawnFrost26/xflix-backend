const mongoose = require("mongoose");
const app = require("./app");
const config = require("./config/config");

mongoose.connect(config.mongoose.url).then(() => {
  console.log("Connected to MongoDB at", config.mongoose.url);
});

// Start the Node server
app.listen(config.running_process, () => {
  console.log(`App is running on port ${config.running_process}`);
});
// resubmitting the assessement
