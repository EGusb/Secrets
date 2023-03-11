const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");
mongoose.set("strictQuery", false);

const dbFullPath = `${process.env.DB_URL}:${process.env.DB_PORT}/${process.env.DB_NAME}`;
const secret = process.env.SECRET_STR;
console.log(`Database path: ${dbFullPath}`);
mongoose.connect(dbFullPath);

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});

userSchema.plugin(encrypt, { secret: secret, encryptedFields: ["password"] });
exports.User = mongoose.model("User", userSchema);
