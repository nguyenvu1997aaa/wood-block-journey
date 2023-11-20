import { initContextState } from '@/redux/reducers/context'

class ContextDtos {
    private contextId: string
    private contextType: string
    private entryPointData: TObject

    constructor(contextId: string | null, contextType: string, entryPointData: TObject) {
        this.contextId = contextId || initContextState.contextId
        this.contextType = contextType || initContextState.contextType
        this.entryPointData = entryPointData || initContextState.entryPointData
    }

    toObject() {
        return {
            contextId: this.contextId,
            contextType: this.contextType,
            entryPointData: this.entryPointData,
        }
    }
}

export default ContextDtos
