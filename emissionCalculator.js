const express = require('express');
const app = express();
const cors = require('cors');
const mysql = require('mysql2'); // Added MySQL
const bcrypt = require('bcrypt'); // For password hashing
const validator = require('validator');
const jwt = require('jsonwebtoken');
const PORT = process.env.PORT || 5000;
const router = express.Router();

app.use(cors());
app.use(express.json());

const secretKey = 'your_secret_key';

// Middleware for authenticating requests and attaching user data from JWT
const authMiddleware = (req, res, next) => {
    const authHeader = req.headers['authorization'];

    if (!authHeader) {
        return res.status(401).json({ error: 'Authorization token required.' });
    }

    const token = authHeader.split(' ')[1]; // Extract the token part

    jwt.verify(token, secretKey, (err, user) => {
        if (err) {
            return res.status(403).json({ error: 'Invalid or expired token.' });
        }

        req.user = user; // Attach user info from the token to the request object
        next();
    });
};

// Login Route: Verifies user credentials and returns a JWT token
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required' });
    }

    const query = 'SELECT * FROM test_Users WHERE username = ?';

    db.query(query, [username], async (err, results) => {
        if (err) return res.status(500).json({ error: 'Database error' });

        if (results.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        const user = results[0];
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid password' });
        }

        // Generate JWT Token
        const token = jwt.sign({ userId: user.id }, secretKey, { expiresIn: '1h' });

        res.status(200).json({
            message: 'Login successful',
            token,
        });
    });
});





app.post('/api/storeEmission', authMiddleware, async (req, res) => {
    const { emissionType, emissionValue, badge } = req.body;
    const userId = req.user.userId; // Extracted from the token

    if (!emissionType || !emissionValue || !badge) {
        return res.status(400).json({ error: 'All fields (emissionType, emissionValue, badge) are required' });
    }

    // Determine which column to update based on emissionType
    let column;
    if (emissionType === 'car') column = 'car_emission';
    else if (emissionType === 'bike') column = 'bike_emission';
    else if (emissionType === 'household') column = 'home_emission';
    else return res.status(400).json({ error: 'Invalid emission type' });

    const query = `
        UPDATE test_Users 
        SET ${column} = ?, badge = ?, last_calculated_date = NOW() 
        WHERE id = ?
    `;

    try {
        db.query(query, [emissionValue, badge, userId], (err, result) => {
            if (err) {
                console.error('Database error:', err);
                return res.status(500).json({ error: 'Database error' });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({ error: 'User not found' });
            }

            res.status(200).json({ message: 'Emission data saved successfully' });
        });
    } catch (err) {
        console.error('Server error:', err);
        res.status(500).json({ error: 'Server error' });
    }
});



  

// User Registration Route
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

// Configure MySQL Connection
const db = mysql.createPool({
    host: 'localhost',    
    user: 'root',         
    password: 'atharva@2212', 
    database: 'sem3_project', 
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
