import React from 'react'
import moment from 'moment-timezone'

export class DateTimePicker extends React.Component {
  render() {
    const format = 'DD/MM/YYYY, HH:mm A'

    const currentDatetimeValue = this.state.value ? this.setTimeValue(this.state.value) : ''

    const requiredError = this.props.required && (this.state.dirty === true || this.props.dirty === true) && !this.state.value
    const minValeError = this.props.min && (this.state.dirty === true || this.props.dirty === true)
      && moment(currentDatetimeValue).isBefore(moment(this.props.min))
    const maxValeError = this.props.max && (this.state.dirty === true || this.props.dirty === true)
      && moment(currentDatetimeValue).isAfter(moment(this.props.max))
    const isValid = !requiredError && !minValeError && !maxValeError

    return (
      <div className="list-item">
        <span className={!this.props.caption || this.props.newLine ? "" : "label"} style={{ lineHeight: '40px' }}>{this.props.required && <i className="asterisk">*</i>} {this.props.caption}</span>
        <span className={!this.props.caption || this.props.newLine ? "" : "field"}>
          <span>
            <input type="datetime-local" className={!isValid ? "input-error" : ''} value={this.state.value} onChange={(evt) => this.inputHandler(evt.target.value)} />
          </span>
        </span>
        <div className="clearfix"/>
        {requiredError && <div className="error-message">This field is required.</div>}
        {minValeError && <div className="error-message">Value must be greater than {this.getTimeValue(this.props.min).format(format)}.</div>}
        {maxValeError && <div className="error-message">Value must be less than {this.getTimeValue(this.props.max).format(format)}.</div>}
      </div>
    )
  }
  constructor(props) {
    super(props)

    const format = 'YYYY-MM-DDTHH:mm:ss'
    const value = this.getTimeValue(props.value).format(format)

    this.state = {
      value: !!props.value ? value : '',
      format: format
    }
  }

  getTimeValue(dateTime) {
    const gap = moment.tz(this.props.timezone).utcOffset() - moment().utcOffset()
    return moment(dateTime).add(gap, 'm')
  }

  setTimeValue(dateTime, format) {
    const formatDateTime = moment(dateTime, 'YYYY-MM-DDTHH:mm:ss')
    const gap = moment.tz(this.props.timezone).utcOffset() - moment().utcOffset()
    const formattedValue = moment(formatDateTime).subtract(gap, 'm').format(format)
    return moment.tz(formattedValue, format, this.props.timezone).toISOString()
  }

  inputHandler(value) {
    const datetime = this.setTimeValue(value)

    this.setState({
      value: value,
      dirty: true
    })

    if (this.props.onValueChanged) {
      this.props.onValueChanged(datetime)
    }
  }
}

export class TimePicker extends React.Component {
  render() {
    const requiredError = this.props.required && (this.state.dirty === true || this.props.dirty === true) && !this.state.time
    const minValeError = this.props.min && (this.state.dirty === true || this.props.dirty === true) && moment(this.state.time, 'HH:mm').isBefore(moment(this.props.min, 'HH:mm'))
    const maxValeError = this.props.max && (this.state.dirty === true || this.props.dirty === true) && moment(this.state.time, 'HH:mm').isAfter(moment(this.props.max, 'HH:mm'))
    const isValid = !requiredError && !minValeError && !maxValeError

    return (
      <div className="list-item">
        <span className="label" style={{ lineHeight: '40px' }}>{this.props.required && <i className="asterisk">*</i>} {this.props.caption}</span>
        <span className="field">
          <span>
            <input type="time" className={!isValid ? "input-error" : ''} value={this.state.time} onChange={(evt) => this.inputHandler(evt.target.value)} />
          </span>
        </span>
        <div className="clearfix"></div>
        {requiredError && <div className="error-message">This field is required.</div>}
        {minValeError && <div className="error-message">Value must be greater than {this.props.min}.</div>}
        {maxValeError && <div className="error-message">Value must be less than {this.props.max}.</div>}
      </div>
    )
  }
  constructor(props) {
    super(props)

    this.state = {
      time: !!props.value ? props.value : '',
      dirty: false,
      valid: true
    }
  }

  inputHandler(value) {
    this.setState({
      time: value,
      dirty: true
    })

    if (this.props.onValueChanged) {
      this.props.onValueChanged(value)
    }
  }

  componentWillReceiveProps(props) {
    this.setState({
      time: (props.value !== undefined &&  props.value !== null) ? props.value : '',
      dirty: props.dirty
    });
  }
}
