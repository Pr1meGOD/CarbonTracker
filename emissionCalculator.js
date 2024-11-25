const express = require('express');
const app = express();
const cors = require('cors');
const mysql = require('mysql2'); // Added MySQL
const bcrypt = require('bcrypt'); // For password hashing
const validator = require('validator');
const jwt = require('jsonwebtoken');
const PORT = process.env.PORT || 5000;
const router = express.Router();
const secretKey = '1234';

app.use(cors());
app.use(express.json());


function authMiddleware(req, res, next) {
    // Retrieve the token from the Authorization header
    const token = req.header('Authorization')?.split(' ')[1];  
    console.log('Received token:', token);  

    // Check if the token is provided
    if (!token) {
        console.error('No token provided.');
        return res.status(401).json({ error: 'Unauthorized: No token provided.' });
    }

    // Verify the token
    jwt.verify(token, '1234', (err, decoded) => {
        if (err) {
            console.error('Token verification error:', err);
            return res.status(401).json({ error: 'Unauthorized: Invalid token.' });
        }

        // Attach user information to the request object
        req.user = decoded;
        next(); // Proceed to the next middleware or route handler
    });
}

module.exports = authMiddleware; // Make sure to export your middleware if needed



// Login Route: Verifies user credentials and returns a JWT token
app.post('/api/login', async (req, res) => {
    const { email, password } = req.body; // Accept `email` and `password` from the frontend

    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
    }

    try {
        const query = 'SELECT * FROM test_Users WHERE username = ?'; // Search by `username` (email)

        db.query(query, [email], async (err, results) => {
            if (err) {
                console.error('Database query error:', err);
                return res.status(500).json({ error: 'Database error' });
            }

            if (results.length === 0) {
                return res.status(404).json({ error: 'User not found' });
            }

            const user = results[0];

            try {
                const isPasswordValid = await bcrypt.compare(password, user.password);

                if (!isPasswordValid) {
                    return res.status(401).json({ error: 'Invalid password' });
                }

                const token = jwt.sign(
                    { userId: user.id, userName: user.username },
                    secretKey,
                    { expiresIn: '100d' }
                );

                res.status(200).json({
                    message: 'Login successful',
                    token,
                });
            } catch (bcryptError) {
                console.error('Password comparison error:', bcryptError);
                return res.status(500).json({ error: 'Error processing password validation' });
            }
        });
    } catch (error) {
        console.error('Unexpected server error:', error);
        return res.status(500).json({ error: 'Server error. Please try again later.' });
    }
});








// Route to handle storing emissions
app.post('/api/storeEmissions', authMiddleware, (req, res) => {
    const {
        carEmissions,
        bikeEmissions,
        householdEmissions,
        car_Badge,
        bike_Badge,
        home_Badge,
        emissionComments,
    } = req.body;

    // Check if user information is extracted properly from the JWT
    if (!req.user || !req.user.userId) {
        return res.status(401).json({ error: 'Unauthorized: Invalid or missing user information.' });
    }
    const userId = req.user.userId;

    // Map valid input fields to database column names
    const validFields = [
        { key: 'car_emissions', value: carEmissions },
        { key: 'bike_emissions', value: bikeEmissions },
        { key: 'household_emissions', value: householdEmissions },
        { key: 'car_badge', value: car_Badge },
        { key: 'bike_badge', value: bike_Badge },
        { key: 'home_badge', value: home_Badge }
    ];

    const updates = [];
    const values = [];

    // Iterate through valid fields and prepare the query updates
    validFields.forEach((field) => {
        if (field.value !== undefined) {
            updates.push(`${field.key} = ?`);
            values.push(field.value);
        }
    });

    // Include the automatic update of the last_calculated_date column
    updates.push('calculation_date = NOW()');

    // Check if there are fields to update (excluding only calculation_date)
    if (updates.length === 1) {
        return res.status(400).json({ error: 'No valid data to update.' });
    }

    // Construct the final SQL query
    const query = `
        UPDATE test_Users
        SET ${updates.join(', ')}
        WHERE id = ?
    `;
    values.push(userId); // Add userId to the values array for WHERE condition

    // Execute the query with the prepared values
    db.query(query, values, (err, result) => {
        if (err) {
            console.error('Error updating database:', err);
            return res.status(500).json({ error: 'Failed to save emission data.' });
        }

        // Handle case where the user ID does not exist in the database
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'User not found.' });
        }

        // Successfully updated the emission data
        res.status(200).json({
            message: 'Emission data saved successfully.',
            hasTrackedEmissions: true, // New flag indicating emissions have been tracked
        });
    });
});







  

// User Registration Route
app.post('/api/register', async (req, res) => {
    let { email, user_name, password } = req.body; // Updated to include user_name

    if (!email || !user_name || !password) {
        return res.status(400).json({ error: 'Email, username, and password are required' });
    }

    email = email.trim();
    user_name = user_name.trim();
    password = password.trim();

    if (!validator.isEmail(email)) {
        return res.status(400).json({ error: 'Invalid email format' });
    }

    if (password.length < 6) {
        return res.status(400).json({ error: 'Password must be at least 6 characters long' });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const query = 'INSERT INTO test_Users (username, user_name, password) VALUES (?, ?, ?)';

        db.query(query, [email, user_name, hashedPassword], (err, result) => {
            if (err) {
                if (err.code === 'ER_DUP_ENTRY') {
                    return res.status(400).json({ error: 'Email already exists' });
                }
                return res.status(500).json({ error: 'Database error' });
            }

            res.status(201).json({ message: 'User registered successfully' });
        });
    } catch (err) {
        console.error('Error during registration:', err);
        res.status(500).json({ error: 'Server error' });
    }
});


// Configure MySQL Connection
const db = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'atharva@2212',
    database: 'sem3_project',
});

db.getConnection((err) => {
    if (err) {
        console.error('Database connection failed:', err);
        throw err;
    }
    console.log('Database connected successfully.');
});






app.get('/api/userProfile', authMiddleware, (req, res) => {
    // Extract user ID from the authenticated request
    const userId = req.user?.userId;

    // Validate that userId exists
    if (!userId) {
        return res.status(400).json({ error: 'User ID is missing or invalid.' });
    }

    // SQL query to fetch user profile data
    const query = `
        SELECT 
            Username,  
            car_emissions, 
            bike_emissions, 
            household_emissions,
            car_badge,
            bike_badge,
            home_badge
        FROM test_Users 
        WHERE id = ?
    `;

    // Execute the database query
    db.query(query, [userId], (err, results) => {
        if (err) {
            console.error('Error fetching user data:', err.message);
            return res.status(500).json({ error: 'Internal server error. Please try again later.' });
        }

        // Check if user was found
        if (!results || results.length === 0) {
            return res.status(404).json({ error: 'User not found. Please check the user ID.' });
        }

        // Return user profile data
        const userData = results[0]; // Extract the first result
        return res.status(200).json(userData);
    });
});




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
        case 'petrol+cng':
            factor = (parseFloat(0.000404) + parseFloat(0.0002)) / 2;  //(can use either of the calculation formula of the below 2)
           // factor = 0.000404 + 0.0002 / 2; 
            break;
        default:
            factor = 0;
    }
    return carMileage * factor;
}


function calculateHomeEmission(electricityUsage, heatingUsage) {
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

// Endpoint to calculate bike emissions (unchanged)
app.post('/api/calculateBikeEmission', (req, res) => {
    const { cc, monthlyMileage } = req.body;

    if (!cc || !monthlyMileage) {
        return res.status(400).json({ error: 'Bike cc and monthly mileage are required' });
    }

    const bikeEmission = calculateBikeEmission(cc, monthlyMileage);
    const badge = getBadge(bikeEmission);

    res.json({ bikeEmission, badge });
});

// Endpoint to calculate car emissions (unchanged)
app.post('/api/calculateCarEmission', (req, res) => {
    const { carMileage, carFuelType } = req.body;

    if (!carMileage || !carFuelType) {
        return res.status(400).json({ error: 'Car mileage and fuel type are required' });
    }

    const carEmission = calculateCarEmission(carMileage, carFuelType);
    const badge = getBadge(carEmission);

    res.json({ carEmission, badge });
});

// Endpoint to calculate home emissions (unchanged)
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
