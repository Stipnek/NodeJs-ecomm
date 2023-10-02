const express = require("express");
const cookieSession = require("cookie-session");
const authRouter = require('./routes/admin/auth');
const crypto = require("crypto");
const fs = require("fs");
const path = require("path");
const adminProductsRouter = require('./routes/admin/products');
const productsRouter = require('./routes/products');
const cartsRouter = require('./routes/carts');

const app = express();
const PORT = 3000;

// Check if the key file exists
const keyFilePath = path.join(__dirname, "sessionKey.txt");
let keys;

if (fs.existsSync(keyFilePath)) {
  // Read the key from the file
  keys = [fs.readFileSync(keyFilePath, "utf-8").trim()];
} else {
  // Generate a random key if it doesn't exist
  const randomBytes = crypto.randomBytes(64);
  keys = [randomBytes.toString("hex")];

  // Save the key to the file for future use
  fs.writeFileSync(keyFilePath, keys[0]);
}

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(
  cookieSession({
    keys: keys,
  })
);
app.use(authRouter);
app.use(adminProductsRouter);
app.use(productsRouter)
app.use(cartsRouter);

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
