import * as constant from './type';

export const initData = (main, common, saveFn, widgets) => dispatch => {
  dispatch({
    type: constant.ACTION_INIT_DATA,
    main, common, saveFn, widgets
  })
};

export const setView = (view) => dispatch => {
  dispatch({
    type: constant.ACTION_SET_VIEW,
    view
  })
};

export const setSelectedItem = (item) => dispatch => {
  dispatch({
    type: constant.ACTION_SET_SELECTED_ITEM,
    item
  })
};

export const saveDataToSf= () => dispatch => {
  dispatch({
    type: constant.ACTION_SAVE_DATA_TO_SALESFORCE
  })
};