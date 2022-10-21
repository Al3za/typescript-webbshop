import { model, Schema, connect } from "mongoose";
import { user_interface } from "@webbshop-app/shared";
const bcrypt = require("bcrypt");

const userModel = new Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

export const setUpMongoDb = async (url: string): Promise<void> => {
  await connect(url);
};

userModel.pre("save", async function () {
  this.password = await bcrypt.hash(this.password, 10);
});

export const checkUser = async (
  user: user_interface
): Promise<user_interface | null> => {
  const findUser = await User.findOne({ username: user.username });
  if (findUser && (await bcrypt.compare(user.password, findUser.password))) {
    return findUser;
  } else {
    throw new Error();
  }
};

export const User = model<user_interface>("user", userModel);

export const saveUser = async (item: user_interface): Promise<void> => {
  const NewUser = new User(item);
  const SaveNewUser = await NewUser.save();
  if (!SaveNewUser) {
    throw new Error("ange giltig data");
  }
};
