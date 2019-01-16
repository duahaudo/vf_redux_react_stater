import React from 'react'

export class LookupTextBox extends React.Component {
  render() {
    const requiredError = this.props.required && (this.state.dirty === true || this.props.dirty === true) && !this.state.value
    const isValid = !requiredError

    return (
      <div className="list-item">
        {this.props.caption && <span className={this.props.newLine ? "" : "label"} style={{ lineHeight: '40px' }}>{this.props.caption}</span>}
        <span className={!this.props.caption || this.props.newLine ? "" : "field"}>
          <span className={"searchbox search-height-46"}>
            <input type={"text"} placeholder={"Search"} className={!isValid ? "input-error" : ''} value={this.state.value} />
            <button type="submit" className="add-on"><i className="sk sk-search" /></button>
          </span>
        </span>
        <div className="clearfix"/>
        {requiredError && <div className="error-message">This field is required.</div>}
      </div>
    )
  }
  constructor(props) {
    super(props)
    this.state = {
      value: !!props.value ? props.value : '',
      type: props.type || 'text',
      dirty: false
    }
  }

  componentWillReceiveProps(props) {
    this.setState({
      value: (props.value !== undefined &&  props.value !== null) ? props.value : '',
      dirty: props.dirty
    });
  }
}