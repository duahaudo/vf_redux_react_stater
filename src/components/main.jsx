import React from 'react';
import Header from './headerContainer'
import Routers from './router.jsx'
import {FatalError, GoBackConfirmModal} from "../../controls";

export default class Main extends React.Component {

  render() {
    return (
      <div>
        <Header onSaveFn={this.saveFn.bind(this)} onGobackFn={this.goBackFn.bind(this)} showConfirm={() => this.setState({showConfirm: true})}/>
        {!this.state.errorId && <section style={{WebkitOverflowScrolling: "touch"}}>
          {/*------------------ common items ---------------------*/}
          <Routers view={this.props.view}/>
        </section>}

        <GoBackConfirmModal show={this.state.showConfirm} onConfirmGoBack={val => this.confirmGoBack(val)}/>
        <div className={`modal ${this.state.showLoading && 'active'}`}>
          <div className="prompt" style={{background: 'transparent', textAlign: 'center'}}>
            <span className="sk sk-spinner skedicon_size_3x icon-spin"> </span>
          </div>
        </div>
        {this.state.errorId && FatalError(this.state.errorId)}
      </div>
    );
  }

  constructor(props) {
    super(props);
    this.state = {
      showConfirm: false,
      showLoading: false,
      dimension: Main.getDimension(),
    };

  }

  goBackFn() {
    // if (this.props.photoShoots.changeSet().length) {
    //   this.setState({showConfirm: true})
    // } else {
    //   window.navGoBack();
    // }

    this.setState({showConfirm: true})
  }

  saveFn(state) {
    this.props.formSaveFunc({
      jobId: this.props.jobId
    }, {
      jobId: this.props.jobId
    })
  }

  // ------------ private function -------------- //

  confirmGoBack(confirm) {
    this.setState({
      showConfirm: confirm
    })
  }

  componentDidMount() {
    window.addEventListener('orientationchange', () => this.handleScreenRotate(), false);
    this.handleScreenRotate()
  }

  handleScreenRotate() {
    this.setState({dimension: Main.getDimension()});
    this.forceUpdate()
  }

  static getDimension() {
    if (window.orientation !== 0) {
      return 1 // types.DIMENSION.landscape
    }
    return 0 // types.DIMENSION.portrait
  }
}
