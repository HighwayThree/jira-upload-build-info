const core = require('@actions/core');
const request = require('request-promise-native');

async function getAccessToken() {
    const clientId = core.getInput('client-id');
    const clientSecret = core.getInput('client-secret');

    let tokenBodyData = {
        "audience": "api.atlassian.com",
        "grant_type":"client_credentials",
        "client_id": clientId || "",
        "client_secret": clientSecret || "",
    };
    tokenBodyData = JSON.stringify(tokenBodyData);
    
    const tokenOptions = {
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

module.exports.getAccessToken = getAccessToken;