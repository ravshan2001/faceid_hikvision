import { Router } from "express";
import passport from "../../middleware/auth.js";
import controller from "../../controllers/statistics/dashboard.js";

const router = Router();

router.use(passport.authenticate('jwt', { session: false }));

router.get("/dashboard", controller.getDashboard);
router.get("/absent-employees", controller.getAbsentEmployees);
router.get("/top-performers", controller.getTopPerformers);
router.get("/monthly-report", controller.getMonthlyReport);
router.get("/trend", controller.getTrend);

export default router;
