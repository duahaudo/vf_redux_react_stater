import React from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

import {VIEW_HOME, VIEW_DETAIL} from './duck/type'

import Page1 from './page1Container'

export default ({view}) => {
  const transitionGroup = {
    transitionName: "slide",
    transitionEnterTimeout: 500,
    transitionAppearTimeout: 450,
    transitionLeaveTimeout: 0.00000001
  };
  return (
    <div>
      <ReactCSSTransitionGroup {...transitionGroup}>

        {view === VIEW_HOME && <Page1/>}
        {view === VIEW_DETAIL && <Page2/>}

      </ReactCSSTransitionGroup>
    </div>
  )
}
