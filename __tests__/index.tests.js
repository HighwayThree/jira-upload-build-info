"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// import * as core from '@actions/core'
const nock_1 = __importDefault(require("nock"));
const index_1 = require("../index");
require('jest-fetch-mock').enableMocks();
// const core = require('@actions/core');
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
    // it('is a test', async () => {
    //   jest.spyOn(core, 'getInput').mockImplementation((name: any): any => {
    //     if (name === 'cloud-instance-base-url') return 'https://example.atlassian.net/'
    //     if (name === 'pipeline-id') return 'test-jira-github-actions-demo CI'
    //     if (name === 'build-number') return '100'
    //     if (name === 'update-sequence-number') return '12345678'
    //     if (name === 'build-display-name') return 'Workflow: CI (#100)'
    //     if (name === 'build-state') return 'successful'
    //     if (name === 'build-url') return 'not-a-real-build'
    //     if (name === 'last-updated') return '2020-01-01T08:01:00Z'
    //     if (name === 'issue-keys') return ''
    //     if (name === 'commit-id') return ''
    //     if (name === 'build-ref-url') return ''
    //     if (name === 'test-info-total-num') return ''
    //     if (name === 'test-info-num-passed') return ''
    //     if (name === 'test-info-num-failed') return ''
    //     if (name === 'test-info-num-skipped') return ''
    //     return ''
    //   });
    // await expect(submitBuildInfo('')).rejects;
    // })
    // it('testing getAccessTokent, no spyOn', async () => {
    //   await expect(getAccessToken()).rejects.toThrow();
    // })
    // it('promise resolves', async () => {
    // })
});
