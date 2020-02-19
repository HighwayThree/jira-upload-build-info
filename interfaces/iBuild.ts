export interface iBuild {
    schemaVersion?: string
    pipelineId: string
    buildNumber: any
    updateSequenceNumber: any
    displayName: string
    url: string
    state: string
    lastUpdated: string
    issueKeys: any []
    testInfo?: {
        totalNumber?: number | string | undefined
        numberPassed?: number | string | undefined
        numberFailed?: number | string | undefined
        numberSkipped?: number | string | undefined
    }
    references: any []
}