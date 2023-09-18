const mongoose = require("mongoose");

const MONGO_URI =
  "mongodb+srv://amitrajjnv2013:2002@AmanKumar@atlascluster.0jupqqk.mongodb.net/e-comm?retryWrites=true&w=majority";
//mongoose.connect(MONGO_URI);
mongoose
  .connect(MONGO_URI, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("connection successful with e-comm");
  })
  .catch((e) => {
    console.log(e);
  });
