const express = require('express');
const app = express();
const cors = require('cors');
const mysql = require('mysql2'); 
const bcrypt = require('bcrypt'); 
const validator = require('validator');
const jwt = require('jsonwebtoken');
const PORT = process.env.PORT || 5000;
const router = express.Router();
const secretKey = '1234';

app.use(cors());
app.use(express.json());

function authMiddleware(req, res, next) {
    const token = req.header('Authorization')?.split(' ')[1];  
    console.log('Received token:', token);  

    if (!token) {
        return res.status(401).json({ error: 'Unauthorized: No token provided.' });
    }

    jwt.verify(token, '1234', (err, decoded) => {
        if (err) {
            console.error('Token verification error:', err);
            return res.status(401).json({ error: 'Unauthorized: Invalid token.' });
        }

        req.user = decoded;
        next();
    });
}





app.post('/api/login', (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required' });
    }

    const query = 'SELECT * FROM users WHERE username = ?';

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

      
        const token = jwt.sign({ userId: user.id }, secretKey, { expiresIn: '3h' });

        res.status(200).json({
            message: 'Login successful',
            token,
        });
    });
});




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

    
    if (!req.user || !req.user.userId) {
        return res.status(401).json({ error: 'Unauthorized: Invalid or missing user information.' });
    }
    const userId = req.user.userId;

    
    const validFields = [
        { key: 'car_emissions', value: carEmissions },
        { key: 'bike_emissions', value: bikeEmissions },
        { key: 'household_emissions', value: householdEmissions },
        { key: 'car_badge', value: car_Badge },
        { key: 'bike_badge', value: bike_Badge },
        { key: 'home_badge', value: home_Badge },
        { key: 'emission_comments', value: emissionComments }, 
    ];

    const updates = [];
    const values = [];

    
    validFields.forEach((field) => {
        if (field.value !== undefined) {
            updates.push(`${field.key} = ?`);
            values.push(field.value);
        }
    });

    
    updates.push('calculation_date = NOW()');

    
    if (updates.length === 1) {
        return res.status(400).json({ error: 'No valid data to update.' });
    }

    
    const query = `
        UPDATE users
        SET ${updates.join(', ')}
        WHERE id = ?
    `;
    values.push(userId); 

    
    db.query(query, values, (err, result) => {
        if (err) {
            console.error('Error updating database:', err);
            return res.status(500).json({ error: 'Failed to save emission data.' });
        }

        
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'User not found.' });
        }

        
        res.status(200).json({
            message: 'Emission data saved successfully.',
            hasTrackedEmissions: true, 
        });
    });
});







  

app.post('/api/register', async (req, res) => {
    let { user_name, username, password } = req.body; 

    if (!user_name || !username || !password) {
        return res.status(400).json({ error: 'Name, email, and password are required' });
    }

    
    user_name = user_name.trim();
    username = username.trim();
    password = password.trim();

  
    if (!validator.isEmail(username)) {
        return res.status(400).json({ error: 'Invalid email format' });
    }

   
    if (password.length < 6) {
        return res.status(400).json({ error: 'Password must be at least 6 characters long' });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10); 

        db.query(
           
            'INSERT INTO users (user_name, username, password) VALUES (?, ?, ?)',
            [user_name, username, hashedPassword], // Pass user_name, username, and hashed password
            (err, result) => {
                if (err) {
                    if (err.code === 'ER_DUP_ENTRY') {
                        return res.status(400).json({ error: 'Email already exists' });
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
   
    const userId = req.user?.userId;

    
    if (!userId) {
        return res.status(400).json({ error: 'User ID is missing or invalid.' });
    }

    
    const query = `
        SELECT 
            Username,  
            car_emissions, 
            bike_emissions, 
            household_emissions,
            car_badge,
            bike_badge,
            home_badge,
            user_name
        FROM users 
        WHERE id = ?
    `;

    
    db.query(query, [userId], (err, results) => {
        if (err) {
            console.error('Error fetching user data:', err.message);
            return res.status(500).json({ error: 'Internal server error. Please try again later.' });
        }

        
        if (!results || results.length === 0) {
            return res.status(404).json({ error: 'User not found. Please check the user ID.' });
        }

        
        const userData = results[0]; 
        return res.status(200).json(userData);
    });
});





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
            factor = (parseFloat(0.000404) + parseFloat(0.0002)) / 2;  
           
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


app.post('/api/calculateBikeEmission', (req, res) => {
    const { cc, monthlyMileage } = req.body;

    if (!cc || !monthlyMileage) {
        return res.status(400).json({ error: 'Bike cc and monthly mileage are required' });
    }

    const bikeEmission = calculateBikeEmission(cc, monthlyMileage);
    const badge = getBadge(bikeEmission);

    res.json({ bikeEmission, badge });
});


app.post('/api/calculateCarEmission', (req, res) => {
    const { carMileage, carFuelType } = req.body;

    if (!carMileage || !carFuelType) {
        return res.status(400).json({ error: 'Car mileage and fuel type are required' });
    }

    const carEmission = calculateCarEmission(carMileage, carFuelType);
    const badge = getBadge(carEmission);

    res.json({ carEmission, badge });
});


app.post('/api/calculateHomeEmission', (req, res) => {
    const { electricityUsage, heatingUsage } = req.body;

    if (!electricityUsage || !heatingUsage) {
        return res.status(400).json({ error: 'Electricity and heating usage are required' });
    }

    const homeEmission = calculateHomeEmission(electricityUsage, heatingUsage);
    const badge = getBadge(homeEmission);

    res.json({ homeEmission, badge });
});



app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});