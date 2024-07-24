
import { Request, Response } from "express";
import {Station} from "../models/station";
import {getStation} from "../controllers/stationController";


// Mocking the Station model
jest.mock("../models/station");

describe("Get single station request", () => {
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

    test("Will return a station by ID", async () => {
        const mockStation = { id: 1, name: "Station 1" };
        const stationId = "1";
        mockRequest = { params: { id: stationId } };

        (Station.findOne as jest.Mock).mockResolvedValue(mockStation);

        const expectedStatusCode = 200;

        await getStation(mockRequest as Request, mockResponse as Response);

        expect(mockResponse.status).toHaveBeenCalledWith(expectedStatusCode);
        expect(responseObject).toEqual(mockStation);
    });

    test("Will return 404 if station is not found", async () => {
        const stationId = "1";
        mockRequest = { params: { id: stationId } };

        (Station.findOne as jest.Mock).mockResolvedValue(null);

        const expectedStatusCode = 404;
        const expectedResponse = { message: "Station not found" };

        await getStation(mockRequest as Request, mockResponse as Response);

        expect(mockResponse.status).toHaveBeenCalledWith(expectedStatusCode);
        expect(responseObject).toEqual(expectedResponse);
    });

});
