const axios = require("axios");

const sendNotification = async (message) => {
  await axios.post(process.env.LINE_NOTIFY_ENDPOINT, null, {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Bearer ${process.env.LINE_NOTIFY_APIKEY}`,
    },
    params: {
      message,
    },
  });
};

module.exports = {
  sendNotification,
};
