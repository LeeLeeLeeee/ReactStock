import {combineReducers} from 'redux'
import stock from './stock'
import stocklist from './stocklist'

const rootReducer = combineReducers({
    stock,
    stocklist
})

export default rootReducer