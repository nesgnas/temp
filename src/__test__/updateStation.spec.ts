import { Request, Response } from "express";
import { Station } from "../models/station";
import { updateStation } from "../controllers/stationController";
import { Types } from "mongoose";

// Mocking the Station model
jest.mock("../models/station");

describe("Update station request", () => {
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

    test("Successfully updates a station", async () => {
        const mockStationId = new Types.ObjectId().toString(); // Use a valid ObjectId
        const mockUpdateData = { name: "Updated Station" };
        const updatedStation = { _id: mockStationId, ...mockUpdateData };
        (Station.findOneAndUpdate as jest.Mock).mockResolvedValue(updatedStation);

        const expectedStatusCode = 200;
        const expectedResponse = updatedStation;

        mockRequest.params = { id: mockStationId };
        mockRequest.body = mockUpdateData;

        await updateStation(mockRequest as Request, mockResponse as Response);

        expect(mockResponse.status).toHaveBeenCalledWith(expectedStatusCode);
        expect(mockResponse.json).toHaveBeenCalledWith(expectedResponse);
    });

    test("Returns 404 if station is not found", async () => {
        const mockStationId = new Types.ObjectId().toString(); // Use a valid ObjectId
        (Station.findOneAndUpdate as jest.Mock).mockResolvedValue(null);

        const expectedStatusCode = 404;
        const expectedResponse = { message: "Station not found" };

        mockRequest.params = { id: mockStationId };
        mockRequest.body = { name: "Updated Station" };

        await updateStation(mockRequest as Request, mockResponse as Response);

        expect(mockResponse.status).toHaveBeenCalledWith(expectedStatusCode);
        expect(mockResponse.json).toHaveBeenCalledWith(expectedResponse);
    });

    test("Returns 400 if ID format is invalid", async () => {
        const invalidId = "invalid-id-format";
        const expectedStatusCode = 400;
        const expectedResponse = { message: "Invalid station ID format" };

        mockRequest.params = { id: invalidId };
        mockRequest.body = { name: "Updated Station" };

        await updateStation(mockRequest as Request, mockResponse as Response);

        expect(mockResponse.status).toHaveBeenCalledWith(expectedStatusCode);
        expect(mockResponse.json).toHaveBeenCalledWith(expectedResponse);
    });

    test("Handles errors gracefully", async () => {
        const mockError = new Error("Database error");
        (Station.findOneAndUpdate as jest.Mock).mockRejectedValue(mockError);

        const expectedStatusCode = 500;
        const expectedResponse = { error: "Database error" };

        mockRequest.params = { id: new Types.ObjectId().toString() }; // Use a valid ObjectId
        mockRequest.body = { name: "Updated Station" };

        await updateStation(mockRequest as Request, mockResponse as Response);

        expect(mockResponse.status).toHaveBeenCalledWith(expectedStatusCode);
        expect(mockResponse.json).toHaveBeenCalledWith(expectedResponse);
    });
});
