const userSchema = require("../models/user.js");

module.exports = async (user2, premium) => {
  switch (premium) {
    case "Premium": {
      const user = await userSchema.findOne({ USERID: user2 });
      return user.PREMIUM;
    }
    case "Voter": {
      const user = await userSchema.findOne({ USERID: user2 });
      return user.VOTED;
    }
    case "DEV": {
      const user = await userSchema.findOne({ USERID: user2 });
      return user.DEV;
    }
    case "TESTER": {
      const user = await userSchema.findOne({ USERID: user2 });
      return user.TESTER;
    }
  }
};
