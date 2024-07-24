import { Router } from "express";
import {
  getStations,
  getStation,
  createStation,
  updateStation,
  deleteStation,
} from "../controllers/stationController";

const router = Router();

router.get("/stations", getStations);
router.get("/stations/:id", getStation);
router.post("/stations", createStation);
router.put("/stations/:id", updateStation);
router.delete("/stations/:id", deleteStation);

export default router;
