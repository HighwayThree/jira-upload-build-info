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
        totalNumber?: number
        numberPassed?: number
        numberFailed?: number
        numberSkipped?: number
    }
    references: any []
}