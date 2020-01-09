const { AccessTokenService } = require("../components/accessToken");
const { AppClientService } = require("../components/appClient");
const { UserService } = require("../components/user");
const jwt = require("jsonwebtoken");
const OAuth2Server = require("express-oauth-server");

const oauth2 = new OAuth2Server({
  model: {
    generateAccessToken: (cl, user, scope) => {
      const payload = { _id: user._id };
      const secret = process.env.JWT_SECRET || "c@shb@ck";
      return jwt.sign(payload, secret, {
        expiresIn: 60 * 30
      });
    },
    getAccessToken: AccessTokenService.findOne,
    getClient: AppClientService.findOne,
    getUser: UserService.signIn,
    saveToken: AccessTokenService.create
  },
  accessTokenLifetime: 60 * 1000
});

module.exports = oauth2;
