import React from 'react'
import moment from 'moment-timezone'
import _ from "lodash";
import {Select} from "./input";

const getTimeValue = (dateTime, timezone) => {
	const gap = moment.tz(timezone).utcOffset() - moment().utcOffset()
	return moment(dateTime).add(gap, 'm')
};

const setTimeValue = (dateTime, timezone, format) => {
	const formatDateTime = moment(dateTime, 'YYYY-MM-DDTHH:mm:ss')
	const gap = moment.tz(timezone).utcOffset() - moment().utcOffset()
	const formattedValue = moment(formatDateTime).subtract(gap, 'm').format(format)
	return moment.tz(formattedValue, format, timezone).toISOString()
};

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

export class DateTimeSelect extends React.Component {
	constructor(props) {
		super(props);

		this.state = this.parseDateTime(props);
		this.state.init = true;

		this.const = {
			years: [moment(), moment().add(1, 'year')].map(item => item.year().toString()),
      months: moment.monthsShort(),
			hours: ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'],
			minutes: ['00', '15', '30', '45'],
			ams: ['AM', 'PM']
		};
	}
	render() {
		const {month, day, year, hour, minute, am} = this.state;
		const {years, ams, hours, minutes, months} = this.const;
		const {required, disabled} = this.props;

		// console.log(month, day, year, hour, minute, am)

		return <div className="form-group-container__col">
			<div className="col-12 rm-pad-r ">
				<div className="form-group-container__col">
					<label className={`form-group-label`}>Start Date {this.props.required && <span aria-hidden="true" className="form-element__header--required"/>}</label>

					<div className="col-4">
						<Select caption="" value={month} options={months} placeholder={"Month"} disabled={disabled}
										onChange={val => this.setDateTimeValue({month: val})}/>
					</div>
					<div className="col-4">
						<Select caption="" value={day} options={this.getMonthDays()} placeholder={"Day"} disabled={disabled}
										onChange={val => this.setDateTimeValue({day: val})}/>
					</div>
					<div className="col-4">
						<Select caption="" value={year} options={years} placeholder={"Year"} disabled={disabled}
										onChange={val => this.setDateTimeValue({year: val})}/>
					</div>
				</div>
			</div>
			<div className="col-12  rm-pad-r ">
				<div className="form-group-container__col">
					<label className={`form-group-label`}>Start Time {this.props.required && <span aria-hidden="true" className="form-element__header--required"/>}</label>

					<div className="col-4">
						<Select caption="" value={hour} options={hours} placeholder={"HH"} disabled={disabled}
										onChange={val => this.setDateTimeValue({hour: val})}/>
					</div>
					<div className="col-4">
						<Select caption="" value={minute} options={minutes} placeholder={"MM"} disabled={disabled}
										onChange={val => this.setDateTimeValue({minute: val})}/>
					</div>
					<div className="col-4">
						<Select caption="" value={am} options={ams} placeholder={"AM/PM"} disabled={disabled}
										onChange={val => this.setDateTimeValue({am: val})}/>
					</div>
				</div>
			</div>
      <div className="clearfix"/>
		</div>
	};

	componentWillUpdate(props) {
	  if (this.state.init && props.value !== this.props.value || props.timezone !== this.props.timezone) {
			const state = this.parseDateTime(props);
			this.setState(state)
		}
	}

	parseDateTime(props) {
	  if (!props.value) return {};

	  // console.log(props)
    const datetime = getTimeValue(props.value, props.timezone);
	  const {months, hours, minutes} = this.const;

	  return {
			month: months[datetime.month()],
      day: datetime.date().toString(),
      year: datetime.year().toString(),
			hour: hours[datetime.hours() % 12],
      minute: minutes.find(item => Number(item) === datetime.minutes()),
      am: datetime.hours() > 12 ? 'PM' : 'AM'
    };
  }

	getMonthDays() {
		let daysInMonth = [];
		let monthDate = moment(this.state.month, 'MMM').startOf('month'); // change to a date in the month of interest

		_.times(monthDate.daysInMonth(), () => {
			daysInMonth.push(monthDate.format('D'));  // your format
			monthDate.add(1, 'day');
		});

		return daysInMonth;
	}

	setDateTimeValue(val) {
		this.setState({...val, init: false});
		if (this.state.init) {
		  this.forceUpdate(() => this.onChangeHandler(val));
    } else {
      this.onChangeHandler(val);
    }
	}

	onChangeHandler(val) {
		let state = _.assign({}, this.state, val);
		const {month, day, year, hour, minute, am} = state;
		const datetime = moment(`${month}/${day}/${year} ${hour}:${minute}${am}`, 'MMM/DD/YYYY HH:mmA');

		if (month && day && year && hour && minute && am  && this.props.onChange) {
			this.props.onChange(datetime.isValid() ? setTimeValue(datetime, this.props.timezone) : null)
		}
	}
}
