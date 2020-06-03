export default {
  namespace: 'status',
  state: {
    name: '', // editor
    tag: [],
    menu: true,
    mode: 'vim',
    view: 2,
    time: '', // file
    font: 0, // editor
    cursor: {
      // edtior
      line: 1,
      ch: 1,
    },
  },
  reducers: {
    update(state: any, action: any) {
      console.log(action.payload);
      return {
        ...state,
        ...action.payload,
      };
    },
    changeMenuShow(state: any, action: any) {
      return {
        ...state,
        menu: !state.menu,
      };
    },
  },
};
