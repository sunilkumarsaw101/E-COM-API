import  jwt  from "jsonwebtoken";
const jwtAuth=(req, res, next)=>{
 //1. read the token.

//  console.log(req.headers);
  
 const token = req.headers['authorization'];
 //2. if token is not present return error.

 if(!token){
  return  res.status(401).send('Unauthorized');
 }
 //3. if token is present and valid.

 try{
 
    const payload= jwt.verify(token, 'Ajsx5sVaaVaDT43VMrxpD9lTnqoPpkLu');
   //  console.log('payload ',payload);
    //fetch the userId from payload and add in req.
    req.userId= payload.userId;
 }
 catch(error){
 //4. if token is present and invalid return error.
 return res.status(401).send("Unauthorized");
 }

 //5. if token is present and valid, call the next middleware in line.
   next();
}

//6. export jwtAuth.
export default jwtAuth;