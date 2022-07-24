import { Optional } from 'utility-types'

export interface ArrayMappingState {
    fromArrayRef: any[]
    toArrayRef: any[]
    currentIndex: number
}

// TODO: make it available for object
export class ArrayLoopExecutionStateManager {
    private arrayMap: Map<Array<any>, ArrayMappingState> = new Map()
    private activeArray?: any[]

    addState(
        state: Optional<ArrayMappingState, 'currentIndex'>,
        name = 'default'
    ) {
        this.arrayMap.set(state.toArrayRef, {
            ...state,
            currentIndex: state.currentIndex === undefined ? -1 : state.currentIndex
        })
    }

    nextState(name = 'default') {
        if (this.activeArray !== undefined) {
            this.arrayMap.get(this.activeArray)!.currentIndex++
        }
    }

    getState(name = 'default'): ArrayMappingState | undefined {
        if (this.activeArray !== undefined) {
            return this.arrayMap.get(this.activeArray)
        }
    }

    setActiveArray(array: any[]) {
        this.activeArray = array
    }

    hasArray(token: any): boolean {
        return this.arrayMap.has(token)
    }
}