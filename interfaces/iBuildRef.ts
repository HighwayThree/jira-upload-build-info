export interface iBuildRef {
    commit: {
        id: string,
        repositoryUri: string,
    },
    ref: {
        name: string,
        uri: string,
    },
}