import { iBuild } from "./interfaces/iBuild";
import { iBuildRef } from "./interfaces/iBuildRef"
import { iOptions } from "./interfaces/iOptions";
import { iTokenOptions } from "./interfaces/iTokenOptions";

const core = require('@actions/core');
const github = require('@actions/github');
const request = require('request-promise-native');
const dateFormat = require('dateformat');

async function submitBuildInfo(accessToken: any) {
    const cloudId = core.getInput('cloud-id');
    const pipelineId = core.getInput('pipeline-id');
    const buildNumber = core.getInput('build-number');
    const buildDisplayName = core.getInput('build-display-name');
    const buildState = core.getInput('build-state');
    const buildUrl = core.getInput('build-url');
    const updateSequenceNumber = core.getInput('update-sequence-number');
    let lastUpdated = core.getInput('last-updated');
    const issueKeys = core.getInput('issue-keys');
    const commitId = core.getInput('commit-id');
    const buildRefUrl = core.getInput('build-ref-url');
    const testInfoTotalNum = core.getInput('test-info-total-num');
    const testInfoNumPassed = core.getInput('test-info-num-passed');
    const testInfoNumFailed = core.getInput('test-info-num-failed');
    const testInfoNumSkipped = core.getInput('test-info-num-skipped');

    lastUpdated = dateFormat(lastUpdated, "yyyy-mm-dd'T'HH:MM:ss'Z'");
    const buildRef: iBuildRef = {
        commit: {
            id: commitId || "",
            repositoryUri: `${github.context.event.repository.url}/actions/runs/${github.context.run_id}` || buildRefUrl,
        },
        ref: {
            name: "buildRef",
            uri: buildRefUrl || "",
        },
    };

    let build: iBuild  = {
        schemaVersion: "1.0",
        pipelineId: pipelineId || "",
        buildNumber: buildNumber || github.context.run_number,
        updateSequenceNumber: updateSequenceNumber || null,
        displayName: buildDisplayName || "",
        url: buildUrl || "",
        state: buildState || "",
        lastUpdated: lastUpdated || "",
        issueKeys: issueKeys.split(',') || [],
        references: [buildRef] || [],
    };
    console.log("build.state: " + build.state);

    console.log("testInfoTotalNum: " + testInfoTotalNum);

    if(testInfoTotalNum) {
        console.log("assign test info");
        build.testInfo = {
            totalNumber: testInfoTotalNum,
            numberPassed: testInfoNumPassed,
            numberFailed: testInfoNumFailed,
            numberSkipped: testInfoNumSkipped,
        }
    }
    let bodyData: any =
    {
        builds: [build]
    };
    bodyData = JSON.stringify(bodyData);
    console.log("bodyData: " + bodyData);

    const options: iOptions = {
        method: 'POST',
        url: "https://api.atlassian.com/jira/builds/0.1/cloud/" + cloudId + "/bulk",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization:"Bearer " + accessToken,
        },
        body: bodyData,
    }

    let responseJson = await request(options);
    let response = JSON.parse(responseJson);
    if(response.rejectedBuilds && response.rejectedBuilds.length > 0) {
        const rejectedBuild = response.rejectedBuilds[0];
        console.log("errors: ", rejectedBuild.errors);
        let errors = rejectedBuild.errors.map((error: any) => error.message).join(',');
        errors.substr(0, errors.length - 1);
        console.log("joined errors: ", errors);
        core.setFailed(errors);
    }
    core.setOutput("response", responseJson);
}

async function getAccessToken() {
    const clientId = core.getInput('client-id');
    const clientSecret = core.getInput('client-secret');

    let tokenBodyData: any = {
        "audience": "api.atlassian.com",
        "grant_type":"client_credentials",
        "client_id": clientId || "",
        "client_secret": clientSecret || "",
    };
    tokenBodyData = JSON.stringify(tokenBodyData);
    
    const tokenOptions: iTokenOptions = {
        method: 'POST',
        url: 'https://api.atlassian.com/oauth/token',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: tokenBodyData,
    };
    console.log("tokenOptions: ", tokenOptions);
    const response = await request(tokenOptions);
    console.log("getAccessToken response: ", response);
    return JSON.parse(response);
}

(async function () {
    try {
        const accessTokenResponse = await getAccessToken();
        console.log("accessTokenResponse: ", accessTokenResponse);
        await submitBuildInfo(accessTokenResponse.access_token);
        console.log("finished submiting build info");
    } catch (error) {
        core.setFailed(error.message);
    }
})();

export {submitBuildInfo, getAccessToken};