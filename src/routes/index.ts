import express from "express";
import UserRouter from "./users/user";

import TenantRouter from "./users/tenant";
import PropertyRouter from  "./properties/property";
import PropertyMediaRouter from  "./properties/propertyMedia";
import ApplicationRouter from "./processes/application";
import PaymentRouter from "./processes/payment";
import RepairRouter from "./processes/repair";
import ReviewRouter from "./processes/review";


const router = express.Router();

router.use("/user", UserRouter);
router.use("/tenant", TenantRouter);
router.use("/property", PropertyRouter);
router.use("/propertyMedia", PropertyMediaRouter);
router.use("/application", ApplicationRouter);
router.use("/payment", PaymentRouter);
router.use("/repair", RepairRouter);
router.use("/review", ReviewRouter);

export default router;