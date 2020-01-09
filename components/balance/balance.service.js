const axios = require("axios");

module.exports.get = async cpf => {
  try {
    const URL =
      process.env.EXTERNAL_API_URL ||
      "https://mdaqk8ek5j.execute-api.us-east-1.amazonaws.com/v1/cashback";
    const { data } = await axios.get(URL, {
      params: { cpf },
      headers: {
        token: "ZXPURQOARHiMc6Y0flhRC1LVlZQVFRnm"
      }
    });
    return data.body;
  } catch (err) {
    if (err.response) {
      throw new Error(JSON.stringify(err.response.error));
    } else if (err.request) {
      throw new Error(JSON.stringify(err.request.error));
    } else {
      throw err;
    }
  }
};
