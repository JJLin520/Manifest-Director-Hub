import { Router, type IRouter } from "express";
import healthRouter from "./health";
import registrationsRouter from "./registrations";
import authRouter from "./auth";
import numerologyRouter from "./numerology";

const router: IRouter = Router();

router.use(authRouter);
router.use(healthRouter);
router.use(registrationsRouter);
router.use(numerologyRouter);

export default router;
