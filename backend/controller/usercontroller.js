import User from "../model/Usermodel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (user) {
      const match = await bcrypt.compare(password, user.password);
      if (match) {
        const accessToken = jwt.sign(
          { _id: user._id },
          process.env.JWT_SECRET,
          { expiresIn: "7d" }
        );
        user.password = undefined;
        res.status(200).json({ user, accessToken, status: 200 });
      } else {
        return res.status(401).json({ error: "Invalid Crediantials", status: 401 });
      }
    } else {
      return res.status(404).json({ error: "User is not registered",status:404 });
    }
  } catch (error) {
    console.log(error);
  }
};

export const register = async (req, res, next) => {
  try {
    console.log("Request body:", req.body); // Log the incoming request body
    const { username, password, email,role } = req.body;
    const duplicate = await User.findOne({ email });
    if (duplicate) {
      return res.json({ error: "User already exists" });
    } else {
      const hashedPass = await bcrypt.hash(password, 10);
      const user = await new User({
        username,
        email,
        password: hashedPass,
        role
      }).save();
      const accessToken = jwt.sign(
        { _id: user._id },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
      );

      user.password = undefined;

      res.status(201).json({ user, accessToken,status:201 });
    }
  } catch (error) {
    console.log("Error", error);
  }
};

export const allusers = async (req, res, next) => {
  try {
    const search = await User.find();
    res.status(200).json(search);
  } catch (error) {
    console.log(error);
  }
};


export const deleteuser = async (req, res, next) => {
  try{
    const userToDelete=req.params.id;
    const search = await User.findOneAndDelete({ _id: userToDelete }); 
    if(search){
      res.status(200).json({ message: "Deleted User", data: search });
    }
    else{
      res.status(404).json("User not found");
    }
  }
  catch(error){
    console.log(error);
  }
};


export const updateuser = async (req, res, next) => {
  try{
    const usertoUpdate = req.params.id;
    const updatedData = { ...req.body };
    const search = await User.findOneAndUpdate({ _id: usertoUpdate }, updatedData, { new: true });
    if (search) {
      res.status(200).json({ message: "Updated", data: search });
    } else {
      res.status(404).json("User not found");
    }
  }
  catch(error){
    console.log(error);
  }
};

// export const resetpassword = async (req, res) => {
//   try {
//     const { token, newPassword } = req.body;
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     const user = await User.findById(decoded._id);
//     if (!user) {
//       return res.status(400).json({ error: "Invalid token or user does not exist" });
//     }
//     const hashedPassword = await bcrypt.hash(newPassword, 10);
//     user.password = hashedPassword;
//     await user.save();
//     res.status(200).json({ message: "Password has been reset successfully" });
//   } catch (error) {
//     if (error.name === 'TokenExpiredError') {
//       return res.status(400).json({ error: "Reset token has expired" });
//     }
//     console.error("Error in resetPassword controller:", error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// };

export const resetpassword = async (req, res) => {
  try {
    const { token, oldPassword, newPassword } = req.body;

    // Verify the JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded._id);

    // Check if the user exists
    if (!user) {
      return res.status(400).json({ error: "Invalid token or user does not exist" });
    }

    // Compare the old password with the current password in the database
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Old password is incorrect" });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the user's password
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: "Password has been reset successfully" });
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(400).json({ error: "Reset token has expired" });
    }
    console.error("Error in resetPassword controller:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};



export const test = (req, res) => {
  try {
    res.json("Tested");
  } catch (error) {
    console.log(error);
  }
};
