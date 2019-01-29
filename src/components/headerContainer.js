import {connect} from "react-redux";
import {setView} from "./duck/action";

import Header from './header.jsx'

export default connect((store) => ({
  view: store.reducer.view
}), {setView})(Header)
