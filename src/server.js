require("dotenv").config();
const app = require("./index");
const mongoose = require("mongoose");

const bootstrap = () => {
  mongoose
    .connect(process.env.DB_URL, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      app.listen(process.env.PORT, () => {
        console.log(`server started on port: ${process.env.PORT}`);
      });
    })
    .catch((err) => {
      throw new Error(err);
    });
};

bootstrap();

// mongodb://user123>:user123@ds017165.mlab.com:17165/heroku_rw333chf
