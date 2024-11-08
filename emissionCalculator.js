const express = require('express');
const app = express();
const PORT = process.env.PORT || 5000;
const cors = require('cors');
app.use(cors());

// Middleware to parse JSON bodies
app.use(express.json());

// Function to calculate emissions for bike, car, and home
function calculateBikeEmission(cc, monthlyMileage) {
    let emissionFactor;
    if (cc <= 125) emissionFactor = 83.19;  // Emission factor in g/km for small motorbike (up to 125cc)
    else if (cc <= 500) emissionFactor = 101.08;  // Emission factor in g/km for medium motorbike (125cc to 500cc)
    else emissionFactor = 132.52;  // Emission factor in g/km for large motorbike (over 500cc)

    // Convert monthly mileage to total emissions in metric tons
    return (emissionFactor * monthlyMileage) / 1000000;  // Divide by 1,000,000 to convert g to metric tons
}

function calculateCarEmission(mileage, fuelType) {
    const factor = fuelType === 'gasoline' ? 0.000404 : 0.00043;  // Emission factor based on fuel type
    return mileage * factor;  // Return emission in metric tons
}

function calculateHouseEmission(electricityUsage, heatingUsage) {
    const electricityEmission = electricityUsage * 0.000743;
    const heatingEmission = heatingUsage * 0.0053;
    return (electricityEmission + heatingEmission) / 1000;  // Return emission in metric tons
}

function getBadge(emission) {
    if (emission <= 0.5) return 'S';  // Best category
    if (emission <= 1) return 'A';
    if (emission <= 1.5) return 'B';
    if (emission <= 2) return 'C';
    return 'F';  // Worst category
}

// Endpoint to calculate bike emissions
app.post('/api/calculateBikeEmission', (req, res) => {
    const { cc, monthlyMileage } = req.body;

    if (!cc || !monthlyMileage) {
        return res.status(400).json({ error: 'Bike cc and monthly mileage are required' });
    }

    const bikeEmission = calculateBikeEmission(cc, monthlyMileage);  // Calculate in metric tons
    const badge = getBadge(bikeEmission);

    res.json({ bikeEmission, badge });
});

// Endpoint to calculate car emissions
app.post('/api/calculateCarEmission', (req, res) => {
    const { carMileage, fuelType } = req.body;

    if (!carMileage || !fuelType) {
        return res.status(400).json({ error: 'Car mileage and fuel type are required' });
    }

    const carEmission = calculateCarEmission(carMileage, fuelType);  // Calculate in metric tons
    const badge = getBadge(carEmission);

    res.json({ carEmission, badge });
});

// Endpoint to calculate home emissions
app.post('/api/calculateHomeEmission', (req, res) => {
    const { electricityUsage, heatingUsage } = req.body;

    if (!electricityUsage || !heatingUsage) {
        return res.status(400).json({ error: 'Electricity and heating usage are required' });
    }

    const homeEmission = calculateHouseEmission(electricityUsage, heatingUsage);  // Calculate in metric tons
    const badge = getBadge(homeEmission);

    res.json({ homeEmission, badge });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
