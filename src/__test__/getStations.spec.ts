import { Request, Response } from "express";
import {Station} from "../models/station";
import {getStations} from "../controllers/stationController";


// Mocking the Station model
jest.mock("../models/station.ts");

describe("Get all station request", () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let responseObject: any;

  beforeEach(() => {
    mockRequest = {};
    responseObject = {};

    mockResponse = {
      statusCode: 0,
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockImplementation((result) => {
        responseObject = result;
      }),
    };
  });

  test("Will return all stations", async () => {
    const mockStations = [{ id: 1, name: "Station 1" }, { id: 2, name: "Station 2" }];
    (Station.find as jest.Mock).mockResolvedValue(mockStations);

    const expectedStatusCode = 200;

    await getStations(mockRequest as Request, mockResponse as Response);

    expect(mockResponse.status).toHaveBeenCalledWith(expectedStatusCode);
    expect(responseObject).toEqual(mockStations);
  });
});
