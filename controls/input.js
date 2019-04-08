import React from 'react'
import moment from 'moment-timezone'
import _ from 'lodash'

const getTimeValue = (dateTime, zone) => {
  const gap = moment.tz(zone).utcOffset() - moment().utcOffset();
  return moment(dateTime).add(gap, 'm')
};

// noinspection JSUnusedLocalSymbols
const setTimeValue = (dateTime, zone, format) => {
  const formatDateTime = moment(dateTime, 'YYYY-MM-DDTHH:mm:ss');
  const gap = moment.tz(zone).utcOffset() - moment().utcOffset();
  const formattedValue = moment(formatDateTime).subtract(gap, 'm').format(format);
  return moment.tz(formattedValue, format, zone).toISOString()
};

export class Textbox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: !!props.value ? props.value : '',
      type: props.type || 'text',
      dirty: false
    };
  }

  render() {
    const requiredError = this.props.required && (this.state.dirty === true || this.props.dirty === true) && !this.state.value;
    const isValid = !requiredError;

    return (
      <div className="form-group-container__col">
        <label
          className={`form-group-label`}>{this.props.caption} {this.props.required && <span aria-hidden="true" className="form-element__header--required"/>}</label>
        <input className={`form-control ${!isValid ? "input-error" : ''} ${this.props.disabled ? 'disabled' : ''}`}
							 disabled={this.props.disabled} type={this.state.type} ref={this.props.inputRef}
               maxLength={this.props.maxLength} placeholder={this.props.placeholder || ""} value={this.state.value}
							 onFocus={() => this.props.onFocus ? this.props.onFocus() : {}}
							 onBlur={() => this.props.onBlur ? this.props.onBlur() : {}}
               onChange={(evt) => this.inputHandler(evt)}/>
        {requiredError && <div className="error-message">This field is required.</div>}
      </div>
    )
  }

  cleanCharacter(value) {
    let clean = value ? value.replace(/[^0-9.]+/g, '') : '';
    const dot = clean.split('.');

    if (dot.length > 2) {
      dot[0] = dot[0] + '.' + dot[1];
      dot.splice(1, 1); // remove 2nd item
      clean = dot.join('')
    }

    if (!!this.props.maxLength) {
      let tempLength = this.props.maxLength;
      if (clean.indexOf('.') > -1) {
        tempLength += 1
      }

      clean = clean.slice(0, tempLength)
    }

    return clean
  }

  inputHandler(evt) {
    let clean = evt.target.value;

    if (this.state.type === 'number') {
      clean = this.cleanCharacter(clean)
    }

    if (this.props.onChange) {
      this.props.onChange(clean)
    }

    this.setState({
      value: clean,
      dirty: true
    })
  }

  componentWillReceiveProps(props) {
    this.setState({
      value: (props.value !== undefined &&  props.value !== null) ? props.value : '',
      dirty: props.dirty
    });
  }
}

export class Textarea extends React.Component {
  render() {
    // return (
    //   <div className="list-item">
    //     <span className="col-12" style={{ marginBottom: '10px' }}>
    //       {this.props.required && <i className="asterisk">*</i>} {this.props.caption}</span>
    //     <div className="">
    //       <textarea maxLength={this.props.maxLength} value={this.state.value} onChange={(evt) => this.inputHandler(evt)}/>
    //     </div>
    //   </div>
    // )


    const {placeholder, row} = this.props;
    return (
      <div className="form-group-container__col">
        <label
          className={`form-group-label ${this.props.required ? "form-element__header--required" : ""}`}>{this.props.caption}</label>
        <textarea required="" className="form-control" placeholder={placeholder || ""} rows={row || 4}
                  maxLength={this.props.maxLength} value={this.state.value} onChange={(evt) => this.inputHandler(evt)}/>
      </div>
    );
  }
  constructor(props) {
    super(props);
    this.state = {
      value: !!props.value ? props.value : ''
    }
  }

  inputHandler(evt) {
    this.setState({
      value: evt.target.value
    });

    if (this.props.onChange) {
      this.props.onChange(evt.target.value)
    }
  }

  componentWillReceiveProps(props) {
    this.setState({
      value: props.value !== undefined ? props.value : '',
      dirty: props.dirty
    });
  }
}

export class Text extends React.Component {
  render() {
    return (
      <div className="list-item">
        <span className="label">{this.props.caption}</span>
        <span className="field">
          <span>{this.state.value}</span>
        </span>
      </div>
    )
  }

  constructor(props) {
    super(props);

    this.state = {
      value: this.getValue(props.value)
    }
  }

  componentWillReceiveProps(props) {
    this.setState({
      value: this.getValue(props.value)
    });
  }

  getValue(val) {
    let value = val;
    if (this.props.format && !!value) {
      const format = this.props.format.split(':');

      switch (format[0]) {
        case 'date':
          value = getTimeValue(value, props.timezone).format(format[1] || 'DD/MM/YYYY');
          break;
        case 'datetime':
          value = getTimeValue(value, props.timezone).format(format[1] || 'DD/MM/YYYY hh:mmA');
          break
      }
    }

    return value;
  }
}

export class Select extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: !!props.value ? props.value : '',
      dirty: false
    }
  }

  render() {
    const requiredError = this.props.required && (this.state.dirty === true || this.props.dirty === true) && !this.state.value;
    const isValid = !requiredError;

    const options = this.props.options.map(item => {
      if (typeof item === "string") {
        return {
          label: item,
          value: item
        }
      }
      return item;
    });
    const {keyName} = this.props;

    return (
      <div className="form-group-container__col">
        {this.props.caption && <label className={`form-group-label`}>{this.props.caption}{this.props.required && <span aria-hidden="true" className="form-element__header--required"/>}</label>}
        <div className={`select ${!!this.state.value ? "" : "select--empty"}`}>
          <select className={`form-control ${!isValid ? "input-error" : ''}  ${this.props.disabled ? 'disabled' : ''}`} value={this.state.value} disabled={this.props.disabled}
                  onChange={(evt) => this.onChangeHandler(evt)}>
            <option value="">{this.props.placeholder}</option>
            {options.map((item, idx) => <option key={idx} value={item[keyName || "value"]}>{item.label}</option>)}
          </select>
          {requiredError && <div className="error-message">This field is required.</div>}
        </div>
      </div>
    );
  }

  onChangeHandler(evt) {
    this.setState({
      value: evt.target.value,
      dirty: true
    });
    // if (this.props.onSelectionChanged) {
    //   this.props.onSelectionChanged(evt.target.value)
    // }

    if (this.props.onChange) {
      this.props.onChange(evt.target.value)
    }
  }

  componentWillReceiveProps(props) {
    this.setState({
      value: props.value !== undefined ? props.value : '',
      dirty: props.dirty
    });
  }
}

export class MultiSelect extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: props.value || ''
    }
  }

  render() {
    const options = this.props.options.map((item, idx) => {
      return <div className="list-item item-checkbox" key={idx}>
        <label className="checkbox">
          <input type="checkbox" checked={this.state.value.indexOf(item.value) > -1}
                 onChange={(evt) => this.selectedItemChanged(evt, item)}/>
          {item.label}
        </label>
      </div>
    });
    return (
      <div className="list-item">
        <p>{this.props.caption}</p>
        <div className="list list-checkbox list-multiselect">{options}</div>
      </div>
    )
  }

  selectedItemChanged(evt, item) {
    let items = _.compact(this.state.value.split(';'));
    const index = items.indexOf(item.label);

    if (evt.target.checked && index === -1) {
      items.push(item.value)
    } else {
      items.splice(index, 1);
    }

    this.state.value = items.join(';');

    this.setState({
      value: this.state.value
    });

    if (this.props.onChange) {
      this.props.onChange(this.state.value);
    }
  }
}

export class Lookup extends React.Component {
  render() {
    return (
      <div className="list">
        <div className="list-item">
          <span className="label" style={{ lineHeight: '40px' }}>{this.props.caption}</span>
          <span className="field">
            <div className="searchbox search-height-46" onClick={this.openItemsPanel.bind(this)}>
              <input type="text" placeholder="" value={this.state.value[this.props.nameValue]} readOnly={true} style={{ paddingLeft: 0 }} />
              <button type="submit" className="add-on"><i className="sk sk-search" /></button>
            </div>
          </span>
        </div>
      </div>
    )
  }

  constructor(props) {
    super(props);
    this.state = {
      value: props.value || {}
    }
  }

  openItemsPanel() {
    if (this.props.onClickHandler) {
      this.props.onClickHandler()
    }
  }
}

export class Checkbox extends React.Component {
  render() {
    return (
      <div className="list-item">
        <span className="" style={{ lineHeight: '30px' }}>
          {this.props.required && <i className="asterisk">*</i>} {this.props.caption}</span>
        <label className="checkbox fr">
          <input type="checkbox" checked={this.state.value} onChange={(evt) => this.inputHandler(evt)} disabled={this.props.disabled} className={this.props.disabled ? 'disabled' : ''} />
        </label>
      </div>
    )
  }
  constructor(props) {
    super(props);
    this.state = {
      value: !!props.value
    }
  }

  inputHandler(evt) {
    this.setState({
      value: evt.target.checked
    });

    if (this.props.onChange) {
      this.props.onChange(evt.target.checked)
    }
  }

  componentWillReceiveProps(props) {
    this.setState({
      value: !!props.value
    });
  }
}

export class RadioList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: props.value
    }
  }

  render() {
    const requiredError = this.props.required && this.props.dirty === true && (this.state.value === undefined);
    const isValid = !requiredError;
    const options = this.props.options.map((item, idx) => {
      return <div className="list-item item-radio" key={idx}>
        <input type="radio" name={this.props.name || Date.now()}
               checked={this.state.value === item.value}
               onChange={(evt) => this.selectedItemChanged(evt, item)} />
        <div className="item-content"> {item.label} </div>
        <div className="itemRight">
          <i className="sk sk-check"/>
        </div>
      </div>
    });
    return (
      <div className="list-item">
        <p>{this.props.required && <i className="asterisk">*</i>} {this.props.caption}</p>
        {!isValid && <div className="error-message">This field is required.</div>}
        <div className="list list-radio">{options}</div>
      </div>
    )
  }

  selectedItemChanged(evt, item) {
    if (evt.target.checked) {
      this.setState({
        value: item.value
      });

      if (this.props.onChange) {
        this.props.onChange(item.value);
      }
    }
  }
}

export class Toggle extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: !!props.value
    }
  }

  render() {
    return (
      <div className="form-group-container__col" style={{paddingTop: '20px'}}>
        <label className={`form-group-label ${this.props.required ? "form-element__header--required" : ""}`}
               style={{marginTop: 0, display: 'inline-block'}}>{this.props.caption}</label>
        <div className="flip-switch fr">
          <input type="checkbox" className={`flip-switch__input ${this.props.disabled ? 'disabled' : ''}`}
                 checked={this.state.value} onChange={(evt) => this.inputHandler(evt)}/>
          <div className="flip-switch__bar"/>
        </div>
        <div className="clearfix"/>
      </div>
    );
  }

  inputHandler(evt) {
    this.setState({
      value: evt.target.checked
    });

    if (this.props.onChange) {
      this.props.onChange(evt.target.checked)
    }
  }

  componentWillReceiveProps(props) {
    this.setState({
      value: !!props.value
    });
  }
}

export class ImageUpload extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: !!props.value
    }
  }

  render() {
    const {title, hint, caption, action, className, preview, clear} = this.props;
    return (
      <div className={className || ""}>
        <h2 className="content-section__title">{title || "Images"}</h2>
        <h3 className="content-section__description">{hint || "Allowed file size is up to 5MB."}</h3>
        {!preview && <button type="button" className="report-form__add-image-btn" onClick={() => action()}>
          <span>{caption || "Attach images"}</span></button>}
        {preview && <div className="image-upload-preview" onClick={() => action()}>
          <div className="delete-icon-wrapper" onClick={(evt) => {
            evt.stopPropagation();
            clear()
          }}>
            <i className="sk sk-close-circle"/>
          </div>
          <img src={preview} alt=""/>
        </div>}
      </div>
    );
  }

  componentWillReceiveProps(props) {
    this.setState({
      value: !!props.value
    });
  }
}

export class Select2 extends React.Component{
	render() {
		const requiredError = this.props.required && (this.state.dirty === true || this.props.dirty === true) && !this.state.value;
		const isValid = !requiredError;
		const term = this.state.value && this.state.value.toLowerCase();
		const options = this.state.options;

		return (
			<div className="form-group-container__col sked-autocomplete">
				<Textbox caption={this.props.caption} value={this.state.value} required={this.props.required}
                 disabled={this.props.disabled}
                 placeholder={this.props.placeholder !== undefined ? this.props.placeholder : "Select"}
                 onChange={(val) => this.onSearchChangedHandler(val)} inputRef={this.props.inputRef}
								 onFocus={() => this.setState({
									 value: ''
								 })
								 }
								 onBlur={() => setTimeout(this.setState({
									 value: this.props.value || '',
									 showOptions: false,
									 options: []
								 }), 700)}
        />

				{this.state.showOptions && <div className="option-list-groups">
					<div className="option-list-group">
						{this.state.showLoading && <div className="option-list-group">
							<div className="option-list scroll">
								<div className="loading-throb sk-loading">
									<div className="bounce1"/>
									<div className="bounce2"/>
									<div className="bounce3"/>
								</div>
							</div>
						</div>}
						<div className="option-list scroll">
							{options.map((option, idx) => <div key={idx} className={`option-list-item ${this.state.value === option.value && 'highlighted'}`}>
								<div className="ellipsis" onMouseDown={(event) => {
									this.onChangeHandler(option)
								}}>{option.label}</div>
							</div>)}
						</div>
					</div>

				</div>}

				<div className={`ski ski-chevron ${this.state.showOptions && 'up'}`} onClick={() => this.setState({
					value: !this.state.showOptions ? '' : this.props.value,
					showOptions: !this.state.showOptions
				})}/>
      </div>
    );
	}

	constructor(props) {
		super(props);
		this.state = {
			value: !!props.value ? props.value : '',
			options: [],
			dirty: false,
			showOptions: false,
			showLoading: false
		}
	}

	componentDidMount() {
		this.searchUpdateHandler = _.debounce(this.searchUpdateHandler, 500);
	}

	async searchUpdateHandler(term) {
		const result = await this.props.retrieveFn(term);
		// console.log(result)
		this.setState({
			options: result.map(item => ({
				value: item.id || item.Id,
				label: item.name || item.Name || item.label,
				data: {...item}
			})),

			showLoading: false
		});
	};

	async onSearchChangedHandler(value) {
		this.setState({
			value,
			showLoading: true,
			showOptions: true,
			options: []
		});

		this.searchUpdateHandler(value)
	}

	onChangeHandler(item) {
		this.setState({
			value: item.label,
			dirty: true,
			showOptions: false,
			showLoading: false,
			options: []
		});

		if (this.props.onValueChanged) {
			this.props.onValueChanged(item.data)
		}
	}

	componentWillReceiveProps(props) {
		this.setState({
			value: props.value !== undefined ? props.value : '',
			dirty: props.dirty,
			showOptions: false,
			showLoading: false,
			term: ''
		});
	}
}
