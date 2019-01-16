import {initData} from "./duck/action";
import {connect} from "react-redux";

import Main from './main.jsx'

export default connect((store) => ({
  view: store.reducer.view
}), {initData})(Main)