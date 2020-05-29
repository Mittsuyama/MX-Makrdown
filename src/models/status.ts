export default {
  namespace: 'status',
  state: {
    name: '', // editor
    tag: [],
    mode: 'vim',
    view: '1',
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
      return {
        ...state,
        ...action.payload,
      };
    },
  },
};
