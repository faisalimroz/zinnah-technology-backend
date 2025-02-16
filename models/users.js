const bcrypt = require("bcryptjs");
const db = require("../db/db");

const User = {
    create: (email, password, photo, role, callback) => {
        bcrypt.hash(password, 10, (err, hashedPassword) => {
            if (err) return callback(err);

            const query = "INSERT INTO users (email, password, photo, role) VALUES (?, ?, ?, ?)";
            db.query(query, [email, hashedPassword, photo, role], (err, result) => {
                if (err) return callback(err);

                // Return the inserted record including the generated 'id'
                callback(null, { id: result.insertId, email, role });
            });
        });
    },

    findByEmail: (email) => {
        return new Promise((resolve, reject) => {
            const query = "SELECT * FROM users WHERE email = ?";
            db.query(query, [email], (err, results) => {
                if (err) return reject(err);
                resolve(results[0]); // Return the first result since 'email' is unique
            });
        });
    }
    
};

module.exports = User;
