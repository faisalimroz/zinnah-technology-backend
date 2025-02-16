const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/users");
const db = require("../db/db");
const signup = async (req, res) => {
    try {
        const { email, password, photo, role } = req.body;

        // Check if email already exists
        const existing = await 
            User.findByEmail(email);

        if (existing) {
            return res.status(400).json({ message: "Email already exists" });
        }

        // Create new user
        const newUser = await new Promise((resolve, reject) => {
            User.create(email, password, photo, role, (err, result) => {
                if (err) reject(err);
                resolve(result);
            });
        });

        // Generate JWT token
        const token = jwt.sign(
            { id: newUser.id, email, role,photo },
            process.env.JWT_SECRET,
             { expiresIn: '1d' } 
        );

        res.status(201).json({ token });
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ message: "Server Error" });
    }
};


const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findByEmail(email);
        if (!user) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid email or password" });
        }



        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role ,photo:user.photo },
            process.env.JWT_SECRET,
            { expiresIn: '1d' } 
        );

        res.json({ token });

    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ message: "Server Error" });
    }
}

// Function to check user role
const userStatus = async (req, res) => {
    const { email } = req.query; // Get the email from query parameters
  
    try {
      if (!email) {
        return res.status(400).json({ message: "Email is required" });
      }
  
      // Using db.query (not db.execute)
      db.query("SELECT * FROM users WHERE email = ?", [email], (err, result) => {
        if (err) {
          return res.status(500).json({ message: "Internal server error", error: err });
        }
  
        // result is an array, so we access the first row
        if (result.length === 0) {
          return res.status(404).json({ message: "User not found" });
        }
  
        // Get user role
        const userRole = result[0].role; // Access the first row
  
        return res.json({ role: userRole }); // Respond with role
      });
    } catch (error) {
      console.error("Error fetching user status:", error);
      res.status(500).json({ message: "Internal server error" });
    }
};

module.exports = { login,signup,userStatus};