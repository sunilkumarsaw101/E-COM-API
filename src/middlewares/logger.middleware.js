// import fs from "fs";
import winston from "winston";
// const fsPromise = fs.promises;

// async function log(logData) {
//   try {
//     logData = `\n ${new Date().toString()}-${logData}`;
//     await fsPromise.appendFile("log.txt", logData);
//   } catch (err) {
//     console.log(err);
//   }
// }

//using winston library.
const logger = winston.createLogger({
  level: "info",
  format: winston.format.json(),
  defaultMeta: { service: "request-logging" },
  transports: [new winston.transports.File({ filename: "logs.txt" })],
});

const loggerMiddleware = async (req, err,  res, next) => {
  // console.log('object');
  // console.log(req.url);
  // console.log('error:', err);
  //logs requests whose url doest not include signin.
  if (!req.url.includes("signin")) {
    //log request body.
    const logData = `${req.url}-${JSON.stringify(req.body)}`;
    // await log(logData);
    // console.log('log data ',logData);
    logger.info(logData);
  }
  next();
};

export default loggerMiddleware;
