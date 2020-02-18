# Jira Upload Build Info

This Github Action uploads build information to specified Jira issues belonging to a connected Jira Cloud instance via the Jira Software REST API. 

## Requirements

#### GitHub and Jira Cloud

Have the `GitHub for Jira` app installed on the Jira Cloud instance you plan to use. 

Have `Jira Software + GitHub` installed on your GitHub account. It can be found at:
> https://github.com/marketplace/jira-software-github

Make sure these two are connected. To do this, in Jira Cloud go to  `Settings -> Apps -> Manage Apps -> GitHub`. Click on 'Get Started' to begin connecting yourself to your GitHub account. 

#### Action Secrets
This action requires two secrets to be stored in GitHub. These can be named whatever you want, but for this example they will be `CLIENT_ID` and `CLIENT_SECRET` to go with the required inputs for this action.

In Jira Cloud, navigate to `Settings -> Apps -> OAth credentials`. If you do not have credentials set up to your GitHub account already, create new credentials. The App name can be anything, the Server base URL and Logo URL can be your GitHub account: i.e. https://<span></span>github.com/your-github-account. Set permissions as Developyments: allowed, Builds: allowed, and Development Informaiton: allowed.

`CLIENT_ID` is the Client ID generated in OAth credentials.

`CLIENT_SECRET` is the Client Secret generated in OAth credentials.

Navigate to `Github Repository -> Settings -> Secrets` if you do not already have the secrets saved in the GitHub repository's secrets. Add the ones you are missing. 

## Action Specifications

### Input values

#### Required

Inside your .yml file there should be something that looks like these required variables:

###### Environment variables

```
env:
  GITHUB_RUN_ID: ${{secrets.GITHUB_RUN_ID}}
  GITHUB_RUN_NUMBER: ${{secrets.GITHUB_RUN_NUMBER}}
```

For more information on Github Environment Variables, see https://help.github.com/en/actions/configuring-and-managing-workflows/using-environment-variables#default-environment-variables

###### Job specific variables

```
uses: HighwayThree/jira-upload-build-info@master
with:
  client-id: '${{ secrets.CLIENT_ID }}'
  client-secret: '${{ secrets.CLIENT_SECRET }}'
  cloud-instance-base-url: '${{ secrets.CLOUD_INSTANCE_BASE_URL }}'
  issue-keys: "${{ steps.jira_keys.outputs.jira-keys }}"
```

- `client-id` - Access token found in OAth credentials of your Jira Cloud website.
- `client-secret` - Access token found in OAth credentials of your Jira Cloud website.
- `cloud-instance-base-url` - The base URL of your connected Jira Cloud. In this example it is stored in a GitHub secret, but another example could be 'https://example.atlassian.net'
- `issue-keys` - Key values that correspond with Jira issues of the connected Jira Cloud.

#### Optional

If `these` job specific variables are not specified in the user's .yml file, then they are given the 'default values' seen below by the action.

- `pipeline-id`: '${{ github.repository }} ${{ github.workflow }}'
  - '${{ github.repository }} ${{ github.workflow }}' = user/test-jira-github-actions-demo CI
  - Can be any string
- `build-number`: ${{ github.run_number }}
  - ${{ github.run_number }} = 100
  - Can be any number
- `build-display-name`: 'Workflow: ${{ github.workflow }} (#${{ github.run_number }})'
  - 'Workflow: ${{ github.workflow }} (#${{ github.run_number }})' = Workflow: CI (#100)
  - Can be any string
- `build-state`: "${{ env.BUILD_STATE }}"
   - "${{ env.BUILD_STATE }}" = successful
   - Can be any string
- `build-url`: '${{github.event.repository.url}}/actions/runs/${{github.run_id}}'
  - '${{github.event.repository.url}}/actions/runs/${{github.run_id}}' = https://<span></span>github.com/user/test-jira-github-actions-demo/actions/runs/12345678
  - Can be any string
- `update-sequence-number`: '${{ github.run_id }}'
  - '${{ github.run_id }}' = '12345678'
  - Can be any string
- `last-updated`: '${{github.event.head_commit.timestamp}}'
  - the date-time format for last-updated is yyyy-mm-dd'T'HH:MM:ss'Z'
  - Example Input: 2020-01-01T00:01:00-08:00
  - Example Output: 2020-01-01T08:01:00Z
- `commit-id:` '${{ github.sha }}'
  - See the commit ID under GitHub commit
  - Can be any string
- `repo-url`: '${{ github.event.repository.url }}'
  - https://<span></span>github.com/user/test-jira-github-actions-demo
  - Can be any string
- `build-ref-url`: '${{ github.event.repository.url }}/actions/runs/${{ github.run_id }}'
  - '${{github.event.repository.url}}/actions/runs/${{github.run_id}}' = https://<span></span>github.com/user/test-jira-github-actions-demo/actions/runs/12345678
  - Can be any string
- `test-info-total-num`: 
  - Can be any number or string
- `test-info-num-passed`: 
  - Can be any number or string
- `test-info-num-failed`: 
  - Can be any number or string
- `test-info-num-skipped`: 
  - Can be any number or string

### Output value

- `response` - The JSON response to POSTing the build information to Jira Cloud

## Usage

An example of a pipeline using this actino can be found at: 
> https://github.com/HighwayThree/jira-github-action-integration-demo/blob/master/.github/workflows/ci.yml