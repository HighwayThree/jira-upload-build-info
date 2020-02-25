"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const nock_1 = __importDefault(require("nock"));
const index_1 = require("../index");
require('jest-fetch-mock').enableMocks();
beforeEach(() => {
    jest.resetModules();
    fetchMock.resetMocks();
});
afterAll(() => {
    expect(nock_1.default.pendingMocks()).toEqual([]);
    nock_1.default.isDone();
    nock_1.default.cleanAll();
});
describe('debug action debug messages', () => {
    it('testing submitDeploymentInfo, no access token, expecting it to throw a reject', async () => {
        const fakeToken = '';
        await expect(index_1.submitBuildInfo(fakeToken)).rejects.toThrow();
    });
});
