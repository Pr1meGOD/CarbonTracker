const express = require('express');
const app = express();
const PORT = process.env.PORT || 5000;
const cors = require('cors');
const mysql = require('mysql2'); // Added MySQL
const bcrypt = require('bcrypt'); // For password hashing
const validator = require('validator');
const jwt = require('jsonwebtoken');

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

const secretKey = 'your_secret_key';

// Middleware to authenticate user requests
const authenticateUser = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ error: 'Authorization token required' });
    }
    try {
        const decoded = jwt.verify(token, secretKey);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(403).json({ error: 'Invalid or expired token' });
    }
};

// Configure MySQL Connection
const db = mysql.createPool({
    host: 'localhost',    // Update to your database host
    user: 'root',         // Update to your database user
    password: 'atharva@2212',         // Update to your database password
    database: 'sem3_project' // Update to your database name
});

// Route: User Registration
app.post('/api/register', async (req, res) => {
    let { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required' });
    }

    // Sanitize inputs
    username = username.trim();
    password = password.trim();

    // Validate email
    if (!validator.isEmail(username)) {
        return res.status(400).json({ error: 'Invalid email format' });
    }

    // Validate password strength (e.g., minimum length of 6 characters)
    if (password.length < 6) {
        return res.status(400).json({ error: 'Password must be at least 6 characters long' });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10); // Hash the password

        db.query(
            'INSERT INTO test_Users (username, password) VALUES (?, ?)',
            [username, hashedPassword],
            (err, result) => {
                if (err) {
                    if (err.code === 'ER_DUP_ENTRY') {
                        return res.status(400).json({ error: 'Username already exists' });
                    }
                    return res.status(500).json({ error: err.message });
                }

                res.status(201).json({ message: 'User registered successfully' });
            }
        );
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});


// Route: User Login
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required' });
    }

    db.query(
        'SELECT * FROM test_Users WHERE username = ?',
        [username],
        async (err, results) => {
            if (err) return res.status(500).json({ error: err.message });

            if (results.length === 0) {
                return res.status(404).json({ error: 'User not found' });
            }

            const user = results[0];

            try {
                // Validate the password
                const isPasswordValid = await bcrypt.compare(password, user.password);
                if (!isPasswordValid) {
                    return res.status(401).json({ error: 'Invalid password' });
                }

                // Generate a JWT token
                const secretKey = 'your_secret_key'; // Replace with a secure environment variable in production
                const token = jwt.sign({ user_id: user.id }, secretKey, { expiresIn: '1h' });

                // Respond with success message and token
                res.status(200).json({ 
                    message: 'Logged in successfully', 
                    userId: user.id, 
                    token 
                });
            } catch (error) {
                res.status(500).json({ error: 'Error during authentication' });
            }
        }
    );
});




app.post('/api/save-car-emission', authenticateUser, (req, res) => {
    const { carEmission, badge } = req.body;
    const userId = req.user.user_id;

    if (!carEmission || !badge) {
        return res.status(400).json({ error: 'carEmission and badge are required' });
    }

    const sqlQuery = `
        UPDATE test_Users
        SET car_emissions = ?, badge = ?, calculation_date = NOW()
        WHERE user_id = ?;
    `;

    db.query(sqlQuery, [carEmission, badge, userId], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Database update failed' });
        }

        res.status(200).json({ message: 'Emission data saved successfully!' });
    });
});


// Function to calculate emissions for bike, car, and home (unchanged from your code)
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



// Route: Store Emission Data
app.post('/api/storeEmission', async (req, res) => {
    const { user_id, emissionType, emissionValue, badge } = req.body;

    if (!user_id || !emissionType || !emissionValue || !badge) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    try {
        // Prepare SQL query based on the emission type
        let column;
        if (emissionType === 'car') column = 'car_emissions';
        else if (emissionType === 'bike') column = 'bike_emissions';
        else if (emissionType === 'household') column = 'household_emissions';
        else return res.status(400).json({ error: 'Invalid emission type' });

        const query = `
            UPDATE test_Users
            SET ${column} = ?, badge = ?, calculation_date = CURRENT_TIMESTAMP
            WHERE user_id = ?
        `;

        // Execute the query
        db.query(query, [emissionValue, badge, user_id], (err, result) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({ error: 'User not found' });
            }

            res.status(200).json({ message: 'Emission data stored successfully' });
        });
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});


// Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
