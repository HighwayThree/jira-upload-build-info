import nock from 'nock'
import {submitBuildInfo} from "../index";
require('jest-fetch-mock').enableMocks()


 beforeEach( () => {
  jest.resetModules();
  fetchMock.resetMocks()
})

afterAll( () => {
expect(nock.pendingMocks()).toEqual([])
nock.isDone()
nock.cleanAll()
})


describe('debug action debug messages', () => {
  it('testing submitDeploymentInfo, no access token, expecting it to throw a reject', async () => {
    const fakeToken = '';
    await expect(submitBuildInfo(fakeToken)).rejects.toThrow();
  })
})