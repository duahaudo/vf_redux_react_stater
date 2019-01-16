import React from 'react'
import {VIEW_HOME} from './duck/type'

export default class Header extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      title: "Redux Stater",
      description: "Stater template"
    }
  }

  render() {
    return (
      <header className="bar-title">
        <button className="btn color-white transparent fl" onClick={this.gobackHandler.bind(this)}>
          <i className="sk sk-chevron-left"/>
        </button>

        <h1 className="title"><span>{this.state.title}</span></h1>
        <h2 className="header-description">{this.state.description}</h2>

        {this.props.view === VIEW_HOME &&
        <button className="btn color-white transparent fr" onClick={() => this.props.saveDataToSf()}>
          Save
        </button>}
      </header>
    )
  }

  gobackHandler() {
    if (this.props.view === VIEW_HOME) {
      // window.navGoBack();

      this.props.onGobackFn();
    } else {
      switch (this.props.view) {
        // case constant.VIEW_DETAIL: this.props.setView(constant.VIEW_MUST_READ_INFORMATION); break;

        default:
          this.props.setView(VIEW_HOME);
      }
    }
  }

  componentDidMount() {
    let count = 1;
    const interval = setInterval(() => {
      if (count === 10) {
        clearInterval(interval);
      }
      if (typeof window.ContainerRegisterBackButtonHandler === 'function') {
        window.ContainerRegisterBackButtonHandler(() => this.gobackHandler());
        clearInterval(interval);
      }
      count++;
    }, 1000)
  }
}
