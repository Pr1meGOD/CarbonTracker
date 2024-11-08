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
    if (cc <= 125) emissionFactor = 83.19;  
    else if (cc <= 500) emissionFactor = 101.08; 
    else emissionFactor = 132.52;  

    return (emissionFactor * monthlyMileage) / 1000000;  
}

function calculateCarEmission(carMileage, carFuelType) {
    let factor;
    switch (carFuelType) {
        case 'gasoline':
            factor = 0.000404;
            break;
        case 'diesel':
            factor = 0.00045;
            break;
        case 'hybrid':
            factor = 0.00025;
            break;
        case 'electric':
            factor = 0.00013;
            break;
        default:
            factor = 0;
    }

    return carMileage * factor;
}

function calculateHomeEmission(electricityUsage, heatingUsage) {
    const electricityEmission = electricityUsage * 0.000743; // Emission factor for electricity (kWh)
    const heatingEmission = heatingUsage * 0.0053;  // Emission factor for heating (therms)
    return electricityEmission + heatingEmission;
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
    const { carMileage, carFuelType } = req.body;

    if (!carMileage || !carFuelType) {
        return res.status(400).json({ error: 'Car mileage and fuel type are required' });
    }

    const carEmission = calculateCarEmission(carMileage, carFuelType);  // Calculate emissions
    const badge = getBadge(carEmission);  // Assign badge based on emission level

    res.json({ carEmission, badge });  // Return both carEmission and badge
});

// Update endpoint for home emissions calculation
app.post('/api/calculateHomeEmission', (req, res) => {
    const { electricityUsage, heatingUsage } = req.body; 

    if (!electricityUsage || !heatingUsage) {
        return res.status(400).json({ error: 'Electricity and heating usage are required' });
    }

    const homeEmission = calculateHomeEmission(electricityUsage, heatingUsage);  
    const badge = getBadge(homeEmission);

    res.json({ homeEmission, badge });
});


// Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
