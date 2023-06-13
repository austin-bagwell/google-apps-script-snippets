import { jest } from "@jest/globals";
import Array2D from "../models/Array2D.js";
jest.mock("../models/Array2D.js");

const testData = [
  ["0A HEADER", "0B HEADER", "0C HEADER", "0D HEADER", "0E HEADER"],
  ["1A", "1B", "1C", "1D", "1E"],
  ["2A", "2B", "2C", "2D", "2E"],
  ["3A", "3B", "3C", "3D", "3E"],
  ["4A", "4B", "4C", "4D", "4E"],
  ["5A", "5B", "5C", "5D", "5E"],
];

beforeEach(() => {
  // Clear all instances and calls to constructor and all methods:
  Array2D.mockClear();
});

it("We can check if the consumer called the class constructor", () => {
  const array2D = new Array2D(testData);
  expect(array2D).toHaveBeenCalledTimes(1);
});
