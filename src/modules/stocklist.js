import { createAction, handleActions } from "redux-actions";
const SELECT = "stocklist/SELECT";
export const select = createAction(SELECT);

const initialState = {
  list: [
    {
      code: "000120",
      name: "CJ대한통운",
      start: "154,000",
      close: "151,500",
      diff: "-2500",
      checked: false,
    },
    {
      code: "161580",
      name: "필옵틱스",
      start: "14,200",
      close: "13,400",
      checked: false,
    },
  ],
};

const stocklist = handleActions(
  {
    [SELECT]: (state, { paylode: id }) => ({
      ...state,
      list: state.list.map((item) =>
        item.code === id ? { ...item, checked: true } : item
      ),
    }),
  },
  initialState
);

export default stocklist;
