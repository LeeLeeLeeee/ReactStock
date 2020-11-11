import { createAction, handleActions } from "redux-actions";
const SELECT = "stocklist/SELECT";
const GETLIST = "stocklist/GETLIST";
const SETOPTION = "stocklist/SETOPTION";
const SETFILTEREDLIST = "stocklist/SETFILTEREDLIST";

export const select = createAction(SELECT);
export const getList = createAction(GETLIST);
export const setOption = createAction(SETOPTION);
export const setFilteredList = createAction(SETFILTEREDLIST);

const initialState = {
  list: [],
  option: {
    code : '',
    type : ''
  },
  filteredList: []
};

const stocklist = handleActions(
  {
    [SELECT]: (state, { paylode: id }) => ({
      ...state,
      list: state.list.map((item) =>
        item.code === id ? { ...item, checked: true } : item
      ),
    }),

    [GETLIST]: (state, {payload: list}) =>({
      ...state,
      list : list.slice()
    }),

    [SETOPTION] : (state, {payload: poption}) => ({
      ...state,
      option : poption
    }),

    [SETFILTEREDLIST] : (state, {payload: list}) => ({
      ...state,
      filteredList : list
    })
    
  },
  initialState
);

export default stocklist;
