var mongoose = require("mongoose"),
  Schema = mongoose.Schema;

var jwt = require("jsonwebtoken");
const { AUTH_COOKIE_NAME } = require("../utils/const");

var UserSchema = mongoose.Schema({
  login: String,
  password: String,
  first_name: String,
  last_name: String
});

UserSchema.statics.checkAuth = () => (req, res, next) => {
  const jwt_token = req.cookies[AUTH_COOKIE_NAME];
  if (!jwt_token)
    return res.json({
      status: "error",
      code: "NOT_AUTHORIZED"
    });
  try {
    req.user = jwt.verify(jwt_token, process.env.JWT_TOKEN_SECRET);
  } catch (err) {
    return res.json({
      status: "error",
      code: "NOT_AUTHORIZED"
    });
  }
  next();
};

UserSchema.methods.getJwtToken = function() {
  const { _id, login } = this;
  return jwt.sign(
    {
      _id,
      login
    },
    process.env.JWT_TOKEN_SECRET
  );
};

var User = mongoose.model("User", UserSchema);
module.exports = User;
