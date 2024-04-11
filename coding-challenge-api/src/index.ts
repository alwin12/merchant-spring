import express from "express";

import cors from "cors";
import { getUser, getOrders } from "./handlers";

const app = express();
const port = 8080;

app.use(cors());
app.get("/user", getUser);

app.get("/sales", getOrders);

app.listen(port, () => {
  console.log(`server started at http://localhost:${port}`);
});
