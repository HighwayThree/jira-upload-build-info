# Jira Upload Build Info

This Github Action is used to upload build information to specified Jira issues belonging to a connected Jira Cloud instance via the Jira Software REST API. 

## Requirements

#### GitHub and Jira Cloud

Have the `GitHub for Jira` app installed on the Jira Cloud instance you plan to use. 

Have `Jira Software + GitHub` installed on your GitHub account. It can be found at:
> https://github.com/marketplace/jira-software-github

Make sure these two are connected. To do this, in Jira Cloud go to  `Settings -> Apps -> Manage Apps -> GitHub`. Click on 'Get Started' to begin connecting yourself to your GitHub account. 

#### Action Secrets
This action requires three secrets to be stored in GitHub. These can be named whatever you want, but for this example they will be `CLOUD_ID`, `CLIENT_ID`, and `CLIENT_SECRET` to go with the required inputs for this action.

The `CLOUD_ID` can be found at your Jira Cloud website + _edge/tenant_info

Example: https://example.atlassian.net/_edge/tenant_info

In Jira Cloud, navigate to `Settings -> Apps -> OAth credentials`. If you do not have credentials set up to your GitHub account already, create new credentials. The App name can be anything, the Server base URL and Logo URL can be your GitHub account: i.e. https://github.com/your-github-account. Set permissions as Developyments: allowed, Builds: allowed, and Development Informaiton: allowed.

`CLIENT_ID` is the Client ID generated in OAth credentials.

`CLIENT_SECRET` is the Client Secret generated in OAth credentials.

Navigate to `Github Repository -> Settings -> Secrets` if you do not already have the secrets saved in the GitHub repository's secrets. Add the ones you are missing. 

## Action Specifications

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
        cloud-id: '${{ secrets.CLOUD_ID }}'
        client-id: '${{ secrets.CLIENT_ID }}'
        client-secret: '${{ secrets.CLIENT_SECRET }}'
        issue-keys: "${{ steps.jira_keys.outputs.jira-keys }}"
```

- `cloud-id` - Access token found at your Jira Cloud website + _edge/tenant_info.
- `client-id` - Access token found in OAth credentials of your Jira Cloud website.
- `client-secret` - Access token found in OAth credentials of your Jira Cloud website.
- `issue-keys` - Key values that correspond with Jira issues of the connected Jira Cloud.

#### Optional

If `these` job specific variables are not specified in the user's .yml file, then they are given the 'default values' seen below by the action.

- `pipeline-id`: '${{ github.repository }} ${{ github.workflow }}'
- `build-number`: ${{ github.run_number }}
- `build-display-name`: 'Workflow: ${{ github.workflow }} (#${{ github.run_number }})'
- `build-state`: "${{ env.BUILD_STATE }}"
- `build-url`: '${{github.event.repository.url}}/actions/runs/${{github.run_id}}'
- `update-sequence-number`: '${{ github.run_id }}'
- `last-updated`: '${{github.event.head_commit.timestamp}}'
- `commit-id:` '${{ github.sha }}'
- `repo-url`: '${{ github.event.repository.url }}'
- `build-ref-url`: '${{ github.event.repository.url }}/actions/runs/${{ github.run_id }}'
