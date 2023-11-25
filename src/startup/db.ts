import mongoose from "mongoose";

export default () => {
  mongoose.set("strictQuery", false);
  mongoose
    .connect(
      "mongodb+srv://shaludama:tRdNtpJAttaltt7l@cluster0.maeoe.mongodb.net/?retryWrites=true&w=majority"
    )
    .then(() => console.log("DB Connected"))
    .catch((err) => console.log(err));
};
