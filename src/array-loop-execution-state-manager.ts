import { Optional } from 'utility-types'

export interface ArrayMappingState {
    fromArrayRef: any[]
    toArrayRef: any[]
    currentIndex: number
}

// TODO: make it available for object
export class ArrayLoopExecutionStateManager {
    private state: { [loopName: string]: ArrayMappingState } = {};

    addState(
        state: Optional<ArrayMappingState, 'currentIndex'>,
        name = 'default'
    ) {
        this.state[name] = {
            ...state,
            currentIndex: state.currentIndex === undefined ? -1 : state.currentIndex
        }
    }

    nextState(name = 'default') {
        this.state[name].currentIndex++
    }

    getState(name = 'default'): ArrayMappingState | undefined {
        return this.state[name]
    }

    hasAnyState(): boolean {
        return !!Object.keys(this.state).length
    }
}