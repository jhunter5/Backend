import app from "./app"
import mongoose from "mongoose";
import env from "./utils/validateEnv";

const port = env.PORT;
mongoose.connect(env.MONGODB_URI)
  .then(() => {
    console.log("Mongoose connected") 
    app.listen(port, () => {
      console.log("Server Started");
    });
    //NODECRON
  })
  .catch(console.error);

export default app;