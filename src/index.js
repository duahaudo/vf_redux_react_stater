import "../assets/stylesheets/sass/skedulo-mobile.scss"

import React from 'react'
import MainComponent from './components/mainContainer'
import {Provider} from "react-redux";
import store from "./store";
import ReactDOM from "react-dom";

export const Root = () => (
	<Provider store={store}>
		<MainComponent/>
	</Provider>
);

if (!module.hot) {
	ReactDOM.render(<Root />, document.querySelector('react'))
}
