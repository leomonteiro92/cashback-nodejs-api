const OAuthClient = require("./components/appClient/appClient.model");

require("./database");

let record;

OAuthClient.findOne({ id: "c@shb@ck", secret: "c@shb@ck " })
  .then(exists => {
    if (!exists) {
      record = new OAuthClient({
        id: "c@shb@ck",
        secret: "c@shb@ck",
        grants: ["password", "refresh_token"]
      });
      return record.save();
    }
    console.info("Client already seeded");
    return exists;
  })
  .then(console.info)
  .catch(console.error)
  .finally(() => {
    process.exit(0);
  });
