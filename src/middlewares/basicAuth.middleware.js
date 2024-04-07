import UserModel from "../features/user/user.model.js";
const basicAuthorizer = (req, res, next) => {
    // console.log('req: ', req);
  //1.checks if the authorization header is empty.
  console.log('headers: ',req.headers);
  const authHeader = req.headers["authorization"];
  console.log("authorization: ",authHeader);

  if (!authHeader) {
    return res.status(401).send("No authorization details found");
  }

  //2.extract credentials .[Basic qqqqqwertjhgfockwencdlskc234sdc]
  const base64Credentials = authHeader.replace("Basic", "");

  console.log( " base64Credentials without Basic: ", base64Credentials);
  let decodedCreds = Buffer.from(base64Credentials, "base64");

  console.log("decodecCred in base64: " ,decodedCreds);
  decodedCreds = decodedCreds.toString("utf8");
  console.log( "decodedCreds in utf8: " ,decodedCreds); //[username:password]

  const cred = decodedCreds.split(":");
  console.log("cred in array: ", cred);
  const user = UserModel.getAllUsers().find(
    (u) => u.email == cred[0] && u.password == cred[1]
  );

  if (user) {
    next();
  } else {
    res.status(401).send("Invalid Credentials");
  }
};

export default basicAuthorizer;
