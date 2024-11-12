// import express from "express";
// import jwt from "jsonwebtoken";
// import bcrypt from "bcrypt";
// import validator from "validator";
// import User from "../models/user.js";

// export async function Register(req, res) {
//   // const { email, password } = req.body; // Destructure email and password from req.body
//   ///

//   // function isC80Email(email) {
//   //   // Ensure the email is valid and ends with @c80.io
//   //   return validator.isEmail(email) && email.endsWith("@c80.io");
//   // }

//   // // Test the function
//   // const email = "user@c80.io";
//   // const result = isC80Email(email) ? "Valid C80 Email" : "Invalid Email";
//   // console.log(result);

//   function isC80Email(email) {
//     return validator.isEmail(email) && email.endsWith("@c80.io");
//   }

//   // Define a POST route to validate email addresses
//   // app.post("/validate-email", (req, res) => {
//   const { email, password } = req.body;

//   // Check if email is valid and has @c80.io domain
//   if (!email) {
//     return res.status(400).json({ message: "Email is required" });
//   }

//   const isValid = isC80Email(email);

//   if (isValid) {
//     return res.json({ message: "Valid C80 Email" });
//   } else {
//     return res
//       .status(400)
//       .json({ message: "Invalid Email. Must use @c80.io domain." });
//   }
//   // });

//   ///
//   // if (!email || !password) {
//   //   return res.status(400).json({ message: "Email and password are required" });
//   // }

//   // if (!validator.isEmail(email)) {
//   //   return res.status(400).json({ message: "Invalid email" });
//   // }

//   try {
//     // Check if the email is already registered
//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return res
//         .status(400)
//         .json({ message: "User with this email already exists" });
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);
//     const newUser = new User({
//       email,
//       password: hashedPassword, // Save the hashed password
//     });

//     await newUser.save(); // Save the user in the database

//     // Return success response
//     res
//       .status(201)
//       .json({ message: "User registered successfully", data: newUser });
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ message: "Error registering user", error });
//   }
// }

// export async function Login(req, res) {
//   // Get the email and password from the req body
//   const { email, password } = req.body; // Destructure email and password from req.body

//   // Check if email and password are provided
//   if (!email || !password) {
//     return res.status(400).json({ message: "Email and password are required" });
//   }

//   const existingUser = await User.findOne({ email });
//   if (!existingUser) {
//     return res.status(400).json({ message: "This email does not exists" });
//   }

//   const isPassword = await bcrypt.compare(password, existingUser.password); // You can now use email and password for further logic
//   if (!isPassword) {
//     return res
//       .status(400)
//       .json({ message: "This email or password is incorrect" });
//   }

//   //
//   const token = jwt.sign(
//     // Payload
//     { email: existingUser.email, userId: existingUser._id },
//     "secretKey"
//   );

//   res.status(200).json({ message: "Login successful", data: { email, token } });

//   // Fetch the corresponding data from the database using the email
//   // If the data exists
//   // Log them in
//   // Return the data back to the user
//   // Else
//   // Return an error
//   // res.send(200);
// }
import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import validator from "validator";
import User from "../models/user.js";
import moment from "moment";

// Function to validate email domain
function isC80Email(email) {
  return validator.isEmail(email) && email.endsWith("@c80.io");
}

// Registration function
export async function Register(req, res) {
  const { email, password } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  const isValid = isC80Email(email);

  if (!isValid) {
    return res
      .status(400)
      .json({ message: "Invalid Email. Must use @c80.io domain." });
  }

  if (!password) {
    return res.status(400).json({ message: "Password is required" });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User with this email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ email, password: hashedPassword });
    await newUser.save();

    res
      .status(201)
      .json({ message: "User registered successfully", data: newUser });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error registering user", error });
  }
}

// Login function
export async function Login(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  const existingUser = await User.findOne({ email });
  if (!existingUser) {
    return res.status(400).json({ message: "This email does not exist" });
  }

  const isPassword = await bcrypt.compare(password, existingUser.password);
  if (!isPassword) {
    return res
      .status(400)
      .json({ message: "This email or password is incorrect" });
  }

  const token = jwt.sign(
    { email: existingUser.email, userId: existingUser._id },
    "secretKey"
  );

  res.status(200).json({ message: "Login successful", data: { email, token } });
}

// Clock In function
// export async function ClockIn(req, res) {
//   const { email } = req.body;

//   try {
//     const user = await User.findOne({ email });
//     if (!user) {
//       return res.status(400).json({ message: "User not found" });
//     }

//     if (user.clockIn && !user.clockOut) {
//       return res.status(400).json({ message: "User is already clocked in" });
//     }

//     user.clockIn = moment().toDate();
//     user.clockOut = null; // Reset clock out
//     await user.save();

//     res.json({ message: "Clocked in successfully", clockIn: user.clockIn });
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ message: "Error clocking in", error });
//   }
// }

// // Clock Out function
// export async function ClockOut(req, res) {
//   const { email } = req.body;

//   try {
//     const user = await User.findOne({ email });
//     if (!user) {
//       return res.status(400).json({ message: "User not found" });
//     }

//     if (!user.clockIn) {
//       return res.status(400).json({ message: "User has not clocked in yet" });
//     }

//     user.clockOut = moment().toDate();
//     const clockInTime = moment(user.clockIn);
//     const clockOutTime = moment(user.clockOut);
//     const duration = clockOutTime.diff(clockInTime, "minutes");

//     await user.save();

//     res.json({
//       message: "Clocked out successfully",
//       clockIn: user.clockIn,
//       clockOut: user.clockOut,
//       duration: `${duration} minutes`,
//     });
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ message: "Error clocking out", error });
//   }
// }

///
// Clock In function
export async function ClockIn(req, res) {
  const userId = req.user.userId;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // Check if user is already clocked in
    if (user.clockIn && !user.clockOut) {
      return res.status(400).json({ message: "User is already clocked in" });
    }

    // Set clock-in time and reset clock-out
    user.clockIn = moment().toDate();
    user.clockOut = null;
    await user.save();

    res.json({ message: "Clocked in successfully", clockIn: user.clockIn });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error clocking in", error });
  }
}

// Clock Out function
export async function ClockOut(req, res) {
  const userId = req.user.userId;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // Check if user is clocked in
    if (!user.clockIn) {
      return res.status(400).json({ message: "User has not clocked in yet" });
    }

    // Set clock-out time and calculate duration
    user.clockOut = moment().toDate();
    const duration = moment(user.clockOut).diff(
      moment(user.clockIn),
      "minutes"
    );

    await user.save();

    res.json({
      message: "Clocked out successfully",
      clockIn: user.clockIn,
      clockOut: user.clockOut,
      duration: `${duration} minutes`,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error clocking out", error });
  }
}
