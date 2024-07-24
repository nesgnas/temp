import { Request, Response } from "express";
import { Station } from "../models/station";
import { Types } from "mongoose";
export const getStations = async (req: Request, res: Response) => {
  try {
    const stations = await Station.find();
    res.status(200).json(stations);
  } catch (error) {
    handleError(error, res);
  }
};

export const getStation = async (req: Request, res: Response) => {
  try {
    const station = await Station.findOne({ _id: req.params.id });
    if (station) {
      res.status(200).json(station);
    } else {
      res.status(404).json({ message: "Station not found" });
    }
  } catch (error) {
    handleError(error, res);
  }
};

export const createStation = async (req: Request, res: Response) => {
  try {
    const station = new Station(req.body);
    // console.log("station ######", station)
    await station.save();
    res.status(201).json(station);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: "An unknown error occurred" });
    }
  }
};

export const updateStation = async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid station ID format" });
  }

  try {
    const station = await Station.findOneAndUpdate(
        { _id: id },
        req.body,
        { new: true }
    );
    if (station) {
      res.status(200).json(station);
    } else {
      res.status(404).json({ message: "Station not found" });
    }
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: "An unknown error occurred" });
    }
  }
};

export const deleteStation = async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!validateObjectId(id)) {
    return res.status(400).json({ message: "Invalid station ID format" });
  }

  try {
    const station = await Station.findByIdAndDelete(id);
    if (station) {
      res.status(200).json({ message: "Station deleted successfully" });
    } else {
      res.status(404).json({ message: "Station not found" });
    }
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: "An unknown error occurred" });
    }
  }
};

const validateObjectId = (id: string): boolean => Types.ObjectId.isValid(id);

const handleError = (error: unknown, res: Response) => {
  if (error instanceof Error) {
    res.status(500).json({ error: error.message });
  } else {
    res.status(500).json({ error: "An unknown error occurred" });
  }
};
