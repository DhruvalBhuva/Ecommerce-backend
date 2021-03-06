const express = require("express");
const app = express();
const path = require("path");
const env = require("dotenv");
const Port = process.env.PORT || 7000;
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
env.config(); // environment variable or can say constant

// routes
const adminAuthRoutes = require("./routes/admin/auth");
const userAuthRoutes = require("./routes/auth");
const categoryRoutes = require("./routes/category");
const productsRoutes = require("./routes/product");
const cartRouter = require("./routes/cart");
const initialDataRouter = require("./routes/admin/initialData");
const pageRouter = require("./routes/admin/page");
const addressRouter = require("./routes/address");
const orderRouter = require("./routes/order");

/** To parse json data comming in post request ==> app.use(express.json())
 * Alter nativ of it is use of body-parser */

// midleweres
app.use(cors()); //It allow to make API call from frontEnd
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use("/public", express.static(path.join(__dirname, "uploads"))); //To send staic file such as image

/** For Admin */
app.use("/admin", adminAuthRoutes);
app.use("/admin", categoryRoutes);
app.use("/admin", productsRoutes);
app.use("/admin", initialDataRouter);
app.use("/admin", pageRouter);

//** user */
app.use("/user", userAuthRoutes);
app.use("/user", cartRouter);
app.use("/user", categoryRoutes);
app.use("/user", productsRoutes);
app.use("/user", pageRouter);
app.use("/user", addressRouter);
app.use("/user", orderRouter);

// --------------- Deployment ---------------
__dirname = path.resolve();
if(process.env.NODE_ENV === "production"){
  app.use(express.static(path.join(__dirname, "Admin","build")));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "Admin","build","index.html"));
  })
}
mongoose
  .connect(process.env.DB_CONNECTION, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Database Connected");
  });

app.listen(Port, () => {
  console.log(`Server is running on port ${Port}`);
});
