const express = require('express');
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware to parse JSON bodies
app.use(express.json());

// Function to calculate emissions for bike, car, and home
function calculateBikeEmission(cc, monthlyMileage) {
    let emissionFactor;
    if (cc <= 125) emissionFactor = 0.01;
    else if (cc <= 500) emissionFactor = 0.015;
    else emissionFactor = 0.02;
    return emissionFactor * monthlyMileage;
}

function calculateCarEmission(mileage, fuelType) {
    const factor = fuelType === 'gasoline' ? 0.000404 : 0.00043;
    return mileage * factor;
}

function calculateHouseEmission(electricityUsage, heatingUsage) {
    const electricityEmission = electricityUsage * 0.000743;
    const heatingEmission = heatingUsage * 0.0053;
    return electricityEmission + heatingEmission;
}

function getBadge(emission) {
    if (emission <= 0.5) return 'S';
    if (emission <= 1) return 'A';
    if (emission <= 1.5) return 'B';
    if (emission <= 2) return 'C';
    return 'F';
}

// Endpoint to calculate emissions
app.post('/api/calculateEmission', (req, res) => {
    const { cc, monthlyMileage, carMileage, fuelType, electricityUsage, heatingUsage } = req.body;

    const bikeEmission = calculateBikeEmission(cc, monthlyMileage);
    const carEmission = calculateCarEmission(carMileage, fuelType);
    const homeEmission = calculateHouseEmission(electricityUsage, heatingUsage);

    const totalEmission = bikeEmission + carEmission + homeEmission;
    const badge = getBadge(totalEmission);

    res.json({ bikeEmission, carEmission, homeEmission, totalEmission, badge });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
