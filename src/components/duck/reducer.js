import * as constant from './type';

export default function reducer(state = {
  forceConn: null,
  jobId: window.jobId,
  userId: window.userId,
  job: null,
  view: constant.VIEW_HOME,
  selectedItem: undefined,

  timezone: '',
  timestamp: Date.now(),
  showLoading: false
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
    case constant.ACTION_SHOW_LOADING: {
      return {...state, showLoading: action.show}
    }
    case constant.ACTION_SET_JSFORCE_OBJECT: {
      return {...state, forceConn: action.forceConn}
    }
  }

  return state;
}
