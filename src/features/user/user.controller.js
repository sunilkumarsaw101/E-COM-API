import UserModel from "./user.model.js";
import jwt from "jsonwebtoken";
import UserRepository from "./user.repository.js";
import bcrypt from "bcrypt";

export class UserController {
  constructor() {
    this.userRepository = new UserRepository();
  }

  async resetPassword(req, res){
    const {newPassword}= req.body;
    const hashPassword= await bcrypt.hash(newPassword, 12);
    const userId=  req.userId;

    try{
        await this.userRepository.resetPassword(userId, hashPassword);
        res.status(200).send("Password is reset");
    }catch(err){
      console.log(err);
      res.status(200).send("Something went wrong");
    }
  }
  async signUp(req, res, next) {
    // console.log(req.body);
    const { name, email, password, type } = req.body;
    try{      
      // const hashPassword = await bcrypt.hash(password, 12); 
      const user = new UserModel(name, email, password, type);
      const newUser = await this.userRepository.signUp(user);
      res.status(201).send(newUser);
    }catch(err){
      // console.log(err);
       next(err);
    }
  }

  async signIn(req, res) {
    try {
      // console.log(req.body);

      //1.find the user by email.
      const user = await this.userRepository.findByEmail(
        req.body.email
        // req.body.password
      );

      if (!user) {
        res.status(400).send("Incorrect Credenstials");
      } else {
        //2.compare the plain text password with hashed password.
        const result = await bcrypt.compare(req.body.password, user.password);

        if (!result) {
          res.status(400).send("Incorrect Credenstials");
        } else {
          // console.log('user:', user);
          //3.create token.
          const token = jwt.sign(
            {
              userId: user._id,
              email: user.email,
            },
            process.env.JWT_SECRET,
            {
              expiresIn: "1h",
            }
          );
          //4.send token
          res.status(200).send(token);
        }
      }

      // if (!result) {
      //   // console.log('object');
      //   res.status(400).send("Incorrect Credenstials");
      // } else {
      //   //1.create token.
      //   const token = jwt.sign(
      //     {
      //       userId: result.id,
      //       email: result.email,
      //     },
      //     "Ajsx5sVaaVaDT43VMrxpD9lTnqoPpkLu",
      //     {
      //       expiresIn: "1h",
      //     }
      //   );
      //   //2.sent token
      //   res.status(200).send(token);
      // }
    } catch (err) {
      console.log(err);
      res.status(200).send("Something went wrong");
    }
  }
}
