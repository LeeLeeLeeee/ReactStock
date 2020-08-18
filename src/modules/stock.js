import {createAction, handleActions} from 'redux-actions'

const SELECT = 'stock/SELECT'
const GROUPCHOICE = 'stock/GROUP'

export const select = createAction(SELECT)
export const groupChoice = createAction(GROUPCHOICE)

const initialState = {
    code : "",
    group: ""
}

const stock = handleActions(
    {
        [SELECT] : (state, {payload:code}) => {
            return {
                ...state,
                code : code
            }
        },
        [GROUPCHOICE] : (state, {payload:gcode}) => {
            return {
                ...state,
                group:gcode
            }
        }
    },
    initialState
)

export default stock