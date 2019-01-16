import {connect} from "react-redux";
import {saveDataToSf, setView} from "./duck/action";

import Header from './header.jsx'

export default connect((store) => ({
  view: store.reducer.view
}), {setView, saveDataToSf})(Header)