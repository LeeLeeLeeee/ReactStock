import {createAction, handleActions} from 'redux-actions'

const SELECT = 'stock/SELECT'
const GROUPCHOICE = 'stock/GROUP'
const ALLSTOCK = 'stock/ALLSTOCK'

export const select = createAction(SELECT)
export const groupChoice = createAction(GROUPCHOICE)
export const setAllStock = createAction(ALLSTOCK)

const initialState = {
    code : "",
    group: "",
    allStock: []
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
        },
        [ALLSTOCK] : (state, {payload:allStock}) => {
            return {
                ...state,
                allStock: allStock
            }
        }
    },
    initialState
)

export default stock