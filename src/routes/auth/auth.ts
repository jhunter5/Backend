import express from "express";
import { assignRole} from "../../controllers/auth/roles";
import { verifyProfile } from "../../controllers/auth/hasProfile";

const AuthRouter = express.Router();

AuthRouter.post("/assignRole", assignRole);
AuthRouter.post("/verifyProfile", verifyProfile);

export default AuthRouter;