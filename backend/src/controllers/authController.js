const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Register
exports.register = async (req, res) => {
  try {
    const { Name, Email, Password, Phone, Address, UserType } = req.body;

    // check if user exists
    User.findByEmail(Email, async (err, result) => {
      if (result.length > 0) {
        return res.status(400).send("Email already exists");
      }

      const hash = await bcrypt.hash(Password, 10);

      const newUser = {
        Name,
        Email,
        PasswordHash: hash,
        Phone,
        Address,
        UserType
      };

      User.create(newUser, (err) => {
        if (err) return res.status(500).send(err);
        res.send("User registered successfully");
      });
    });

  } catch (error) {
    res.status(500).send("Server error");
  }
};

// Login
exports.login = (req, res) => {
  const { Email, Password } = req.body;

  User.findByEmail(Email, async (err, result) => {
    if (result.length === 0) {
      return res.status(400).send("User not found");
    }

    const user = result[0];

    const isMatch = await bcrypt.compare(Password, user.PasswordHash);
    if (!isMatch) {
      return res.status(400).send("Wrong password");
    }

    const token = jwt.sign(
      { id: user.UserID, role: user.UserType },
      "secret",
      { expiresIn: "7d" }
    );

    res.json({ token });
  });
};
