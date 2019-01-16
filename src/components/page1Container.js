import {setView} from "./duck/action";
import {connect} from "react-redux";

import Page1 from "./page1.jsx";

export default connect((store) => ({
  view: store.reducer.view,
  widgets: store.reducer.widgets
}), {setView})(Page1)