const core = require('@actions/core');
const github = require('@actions/github');
const request = require('request-promise-native');
const dateFormat = require('dateformat');

var tokenBodyData = {
    "audience": "api.atlassian.com",
    "grant_type":"client_credentials",
    "client_id": '',
    "client_secret": ''
};

var tokenOptions = {
    method: 'POST',
    url: 'https://api.atlassian.com/oauth/token',
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    },
    body: {}
};

let build =
    {
        schemaVersion: "1.0",
        pipelineId: "",
        buildNumber: null,
        updateSequenceNumber: null,
        displayName: "" ,
        url: "",
        state: "",
        lastUpdated: "",
        issueKeys: [],
        testInfo: {
            totalNumber: 0,
            numberPassed: 0,
            numberFailed: 0,
            numberSkipped: 0
        },
        references: []
    };

let buildRef =
    {
        commit: {
            id: "",
            repositoryUri: ""
        },
        ref: {
            name: "buildRef",
            uri: ""
        }
    };

let bodyData =
    {
        builds: []
    };

let options = {
    method: 'POST',
    url: '',
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        Authorization: ''
    },
    body: {}
};

async function submitBuildInfo(accessToken) {
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
    const repoUrl = core.getInput('repo-url');
    const buildRefUrl = core.getInput('build-ref-url');
    const testInfoTotalNum = core.getInput('test-info-total-num');
    const testInfoNumPassed = core.getInput('test-info-num-passed');
    const testInfoNumFailed = core.getInput('test-info-num-failed');
    const testInfoNumSkipped = core.getInput('test-info-num-skipped');

    // console.log("lastUpdated: " + lastUpdated);
    lastUpdated = dateFormat(lastUpdated, "yyyy-mm-dd'T'HH:MM:ss'Z'");
    // console.log("formatted lastUpdated: " + lastUpdated);
    buildRef.commit.id = commitId;
    buildRef.commit.repositoryUri = buildRefUrl;
    buildRef.ref.uri = buildRefUrl;

    build.pipelineId = pipelineId;
    build.buildNumber = buildNumber;
    build.updateSequenceNumber = updateSequenceNumber;
    build.displayName = buildDisplayName;
    build.url = buildUrl;
    build.state = buildState;
    console.log("build.state: " + build.state);
    build.lastUpdated = lastUpdated;
    build.issueKeys = issueKeys.split(',');
    build.references = [buildRef];

    console.log("testInfoTotalNum: " + testInfoTotalNum);

    if(testInfoTotalNum) {
        console.log("assign test info");
        build.testInfo.totalNumber = testInfoTotalNum;
        build.testInfo.numberPassed = testInfoNumPassed;
        build.testInfo.numberFailed = testInfoNumFailed;
        build.testInfo.numberSkipped = testInfoNumSkipped;
    }

    bodyData.builds = [build];
    bodyData = JSON.stringify(bodyData);
    console.log("bodyData: " + bodyData);

    options.body = bodyData;
    options.url = "https://api.atlassian.com/jira/builds/0.1/cloud/" + cloudId + "/bulk";
    options.headers.Authorization = "Bearer " + accessToken;

    // console.log("options: ", options);

    const payload = JSON.stringify(github.context.payload, undefined, 2)
    // console.log(`The event payload: ${payload}`);

    let responseJson = await request(options);
    let response = JSON.parse(responseJson);
    // console.log("response: ", response);
    if(response.rejectedBuilds && response.rejectedBuilds.length > 0) {
        const rejectedBuild = response.rejectedBuilds[0];
        console.log("errors: ", rejectedBuild.errors);
        let errors = rejectedBuild.errors.map(error => error.message).join(',');
        errors.substr(0, errors.length - 1);
        console.log("joined errors: ", errors);
        core.setFailed(errors);
    }
    core.setOutput("response", responseJson);
}

async function getAccessToken() {
    const clientId = core.getInput('client-id');
    const clientSecret = core.getInput('client-secret');

    tokenBodyData.client_id = clientId;
    tokenBodyData.client_secret = clientSecret;
    tokenBodyData = JSON.stringify(tokenBodyData);
    tokenOptions.body = tokenBodyData;
    // const payload = JSON.stringify(github.context.payload, undefined, 2)
    // console.log(`The event payload: ${payload}`);

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
