export default {
  namespace: 'save',
  state: 0,
  reducers: {
    add(state: number, action: any) {
      return state + 1;
    },
  },
};
