const router = require("express").Router();
const Customer = require("../Model/Customer");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Admin = require("../Model/Admin");
const Cart = require("../Model/Cart");
const { OAuth2Client } = require("google-auth-library");

const googleClient = new OAuth2Client({
  clientId: `${process.env.GOOGLE_CLIENT_ID}`,
});


const adminAuth = async (requestData, res) => {
  
    const user = await Admin.findOne({ username: requestData.username });

    if (!user) {
      res.status(401).json("User not found!");
      return;
    }

    const validatePass = 
      await bcrypt.compare(requestData.pass, user.pass);

    if (!validatePass) {
      res.status(401).json("Wrong password!");
      return;
    } 

    const { pass, ...others } = user._doc;
    res.status(200).json({...others})

    // const accessToken = jwt.sign(
    //     user.toJSON(),
    //     process.env.JWT_KEY
    //     // {expiresIn: 604800}
    //   );


    // const decoded = jwt.verify(accessToken, process.env.JWT_KEY, (err, user)=> {
    //   req.user = user
    //   next()
    // })



    // res 
    // .cookie("admin_token", accessToken, {
    //   // expires: new Date(new Date().getTime() + 24 * 59 * 1000),
    //   httpOnly: true,
    //   sameSite: "strict"
    // })
    // .cookie("admin_isLogin", true, {
    //   // expires: new Date(new Date().getTime() + 24 * 59 * 1000),
    //   httpOnly: false,
    //   sameSite: "strict"
    // })
    // .status(200)
    // .json(others)
}


const googleAuth = async (requestData, res) => {
    const ticket = await googleClient.verifyIdToken({
        idToken: requestData.token,
        audience: `${process.env.GOOGLE_CLIENT_ID}`,
      });
  
      const payload = ticket.getPayload();
  
      let user = await Customer.findOne({ email: payload?.email });
  
      if (!user) {
        user = new Customer({
          email: payload?.email,
          name: `${payload?.given_name} ${payload?.family_name}`, 
          avatar: payload?.picture,
        });
        await user.save();
  
        const cart = new Cart({ customer_id: user._id });
        await cart.save();
      }
  
      res.status(200).json(user)
      
      // const accessToken = jwt.sign(
      //   user.toJSON(),
      //   process.env.JWT_KEY
      //   // {expiresIn: 604800}
      // );

      // const decoded = jwt.verify(accessToken, process.env.JWT_KEY, (err, user)=> {
      //   req.user = user
      //   next()
      // })


      // res
      //   .cookie("token", accessToken, {
      //     // expires: new Date(new Date().getTime() + 24 * 59 * 1000),
      //     httpOnly: true,
      //     sameSite: "strict"
      //   })
      //   .cookie("isLogin", true, {
      //     // expires: new Date(new Date().getTime() + 24 * 59 * 1000),
      //     httpOnly: false,
      //     sameSite: "strict"
      //   })
      //   .status(200)
      //   .json(user)

}


// AUTH
router.post("/", async (req, res) => {
  try {
    if (req.query.isAdmin) {
        await adminAuth(req.body, res)
        return
    }
    await googleAuth(req.body, res)
  } catch (error) {
    console.log(error);
    res.status(500).json(error)
  }
});


// REGISTER
router.post("/register", async (req, res) => {
  const { pass, username } = req.body;

  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(pass, salt);

    const adminUser = await Admin.findOne({username}) 

    if(adminUser) {
        res.status(403).json('Username is already taken!')
        return
    } 

    const admin = new Admin({
      username,
      pass: hashedPass,
    });

    admin.save();

    res.status(200).json(admin);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});


// LOGOUT
router.get("/logout", (req, res) => {
  try {
    res
    .clearCookie('token')
    .clearCookie('isLogin')
    .status(202)
    .json("cookies cleared")
  } catch (error) {
    console.log(error)
  }
});

module.exports = router;

// const {
// username, firstname, lastname, email,
// } = req.body

// let userInfo;

// const salt = await bcrypt.genSalt(10)
// const hashedPass = await bcrypt.hash(req.body.pass, salt)

// if(req.query.isAdmin) {
//     userInfo = new Admin({
//         username,
//         firstname,
//         lastname,
//         // email,
//         pass: hashedPass
//     })
// } else {
//     userInfo = new Customer({
//         username,
//         pass: hashedPass
//     })
// }

// await userInfo.save()

// const createCart =  new Cart({customer_id: userInfo._id})
// await createCart.save()

// res.status(200).json(userInfo)
