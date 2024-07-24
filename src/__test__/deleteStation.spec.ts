import { Request, Response } from "express";
import { Station } from "../models/station";
import { deleteStation } from "../controllers/stationController";
import { Types } from "mongoose";

// Mocking the Station model
jest.mock("../models/station");

describe("Delete station request", () => {
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

    test("Successfully deletes a station", async () => {
        const mockStationId = new Types.ObjectId().toString(); // Use a valid ObjectId
        (Station.findByIdAndDelete as jest.Mock).mockResolvedValue({ _id: mockStationId });

        const expectedStatusCode = 200;
        const expectedResponse = { message: "Station deleted successfully" };

        mockRequest.params = { id: mockStationId };

        await deleteStation(mockRequest as Request, mockResponse as Response);

        expect(mockResponse.status).toHaveBeenCalledWith(expectedStatusCode);
        expect(mockResponse.json).toHaveBeenCalledWith(expectedResponse);
    });

    test("Returns 404 if station is not found", async () => {
        const mockStationId = new Types.ObjectId().toString(); // Use a valid ObjectId
        (Station.findByIdAndDelete as jest.Mock).mockResolvedValue(null);

        const expectedStatusCode = 404;
        const expectedResponse = { message: "Station not found" };

        mockRequest.params = { id: mockStationId };

        await deleteStation(mockRequest as Request, mockResponse as Response);

        expect(mockResponse.status).toHaveBeenCalledWith(expectedStatusCode);
        expect(mockResponse.json).toHaveBeenCalledWith(expectedResponse);
    });

    test("Handles errors gracefully", async () => {
        const mockError = new Error("Database error");
        (Station.findByIdAndDelete as jest.Mock).mockRejectedValue(mockError);

        const expectedStatusCode = 500;
        const expectedResponse = { error: "Database error" };

        mockRequest.params = { id: new Types.ObjectId().toString() }; // Use a valid ObjectId

        await deleteStation(mockRequest as Request, mockResponse as Response);

        expect(mockResponse.status).toHaveBeenCalledWith(expectedStatusCode);
        expect(mockResponse.json).toHaveBeenCalledWith(expectedResponse);
    });
});
