const fs = require("fs");
const path = require("path");
const jwt = require("jsonwebtoken");
function generateAuthenticationToken(payload) {
  const privateKey = fs.readFileSync(
    path.join(__dirname, "../keys/jwtRS256.key")
  );
  const issuer = process.env.AUTH_TOKEN_ISSUER;
  const secret = privateKey;
  const token = jwt.sign({ ...payload }, secret, {
    algorithm: "RS256",
    issuer
  });

  return "Bearer " + token;
}

exports.generateAuthenticationToken = generateAuthenticationToken;
