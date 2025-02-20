// check if user is logged in can we send sicret data to client
import jwt from "jsonwebtoken";

export const checkAuth = (req, res, next) => {
  // we must pars token from header and check it
  try {
    const token = (req.headers.authorization || "").replace(/Bearer\s?/, "");

    console.log("token => ", token);
    if (token) {
      try {
        const decoded = jwt.verify(token, "secret123");

        req.userId = decoded._id;
        next();
      } catch (e) {
        return res.status(403).json({
          message: "User is not authorized"
        });
      }


    } else {
      return res.status(403).json({
        message: "User is not authorized"
      });
    }

  } catch (e) {
    console.log(" Error in checkAuth => ", e);
  }
}
