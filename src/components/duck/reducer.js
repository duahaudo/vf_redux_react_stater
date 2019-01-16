import * as constant from './type';

export default function reducer(state = {
  main: {},
  common: {},
  saveFn: () => {
  },
  view: constant.VIEW_HOME,
  selectedItem: undefined,

  timezone: '',
  timestamp: Date.now()
}, action) {
  switch (action.type) {
    case constant.ACTION_INIT_DATA: {
      const {main, common, saveFn, widgets} = action;

      return {
        ...state, main, common, saveFn, widgets,
        timestamp: Date.now()
      };
    }
    case constant.ACTION_SET_VIEW: {
      return {
        ...state,
        view: action.view
      };
    }
    case constant.ACTION_SET_SELECTED_ITEM: {
      return {
        ...state,
        selectedItem: {...action.item}
      };
    }
    case constant.ACTION_SAVE_DATA_TO_SALESFORCE: {

      // const changeSet = state.supportNotes.changeSet();
      state.saveFn({
        jobId: state.main.jobId,
      }, {
        // jobId: state.main.jobId,
        // job: state.main.job,
        // contact: state.main.contact,
        // supportNotes: state.supportNotes.listAll(),
        // attachment: state.main.attachment
      }, false, true);

      return {...state};
    }
  }

  return state;
}
