import { Request, Response } from "express";
import { Station } from "../models/station";
import { createStation } from "../controllers/stationController";

// Mocking the Station model
jest.mock("../models/station");

describe("Create station request", () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let responseObject: any;

  beforeEach(() => {
    mockRequest = {};
    responseObject = {};

    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockImplementation((result) => {
        responseObject = result;
      }),
    };
  });

  test("Successfully creates a station", async () => {
    const newStationData = {
      name: "New Station",
      address: "123 Main St",
      city: "Metropolis",
      latitude: 40.7128,
      longitude: -74.006,
      pumps: [],
    };
    const createdStation = {
      ...newStationData,
    };

    const saveMock = jest.fn().mockResolvedValue(createdStation);
    (Station as unknown as jest.Mock).mockImplementation(() => ({
      ...newStationData,
      save: saveMock,
    }));

    const expectedStatusCode = 201;

    mockRequest.body = newStationData;

    await createStation(mockRequest as Request, mockResponse as Response);
    expect(mockResponse.status).toHaveBeenCalledWith(expectedStatusCode);
    expect(mockResponse.json).toHaveBeenCalledWith(
      expect.objectContaining({
        name: "New Station",
        address: "123 Main St",
        city: "Metropolis",
        latitude: 40.7128,
        longitude: -74.006,
        pumps: [],
      })
    );
    expect(Station).toHaveBeenCalledWith(
      expect.objectContaining({
        name: "New Station",
        address: "123 Main St",
        city: "Metropolis",
        latitude: 40.7128,
        longitude: -74.006,
        pumps: [],
      })
    );
  });

  test("Handles validation errors gracefully", async () => {
    const validationError = new Error("Validation error");
    (Station.prototype.save as jest.Mock).mockRejectedValue(validationError);

    const expectedStatusCode = 500;
    const expectedResponse = { error: "Validation error" };

    mockRequest.body = { name: "Invalid Station" }; // Potentially invalid data

    await createStation(mockRequest as Request, mockResponse as Response);

    expect(mockResponse.status).toHaveBeenCalledWith(expectedStatusCode);
    expect(mockResponse.json).toHaveBeenCalledWith(expectedResponse);
  });

  test("Handles errors gracefully", async () => {
    const mockError = new Error("Database error");
    (Station.prototype.save as jest.Mock).mockRejectedValue(mockError);

    const expectedStatusCode = 500;
    const expectedResponse = { error: "Database error" };

    mockRequest.body = {
      name: "New Station",
      address: "123 Main St",
      city: "Metropolis",
      latitude: 40.7128,
      longitude: -74.006,
      pumps: [],
    };

    await createStation(mockRequest as Request, mockResponse as Response);

    expect(mockResponse.status).toHaveBeenCalledWith(expectedStatusCode);
    expect(mockResponse.json).toHaveBeenCalledWith(expectedResponse);
  });
});
