const express = require('express');
const bodyParser = require('body-parser');
const emissionCalculator = require('./emissionCalculator');


const app = express();

app.use(bodyParser.json());
app.use('/api', emissionCalculator);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
