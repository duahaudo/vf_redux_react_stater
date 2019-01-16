import React from 'react';
import {reject} from 'lodash'

export const ListRadioInline = (props) => {
  const {caption, options, onChange, value} = props;
  return <div className="form-group-container__col">
    <label className="form-group-label">{caption}</label>
    <div className="form-element__radio-btn-container">
      {options.map((item, index) => <div key={index} className="form-element__radio-btn">
        <input className="form-element__radio-btn-input" checked={item === value} type="radio" id={`option-${index}`}
               name="radio-btn" value={item} onChange={evt => onChange(item)}/>
        <label htmlFor={`option-${index}`} className="form-element__radio-btn-label">{item}</label>
      </div>)}
    </div>
  </div>
};

export const MultiPicklist = props => {
  const {caption, options, value, onChange} = props;

  let selectedItem = (value || "").split(';');
  const onChangedHandler = (checked, item) => {
    if (!checked) {
      selectedItem = reject(selectedItem, i => item === i)
    } else {
      selectedItem.push(item)
    }

    onChange(selectedItem.join(';'))
  };

  return <div className="form-group-container__col">
    <label className="form-group-label">{caption}</label>
    <div className="form-element__multiple-container form-element__multiple-container--checkbox">

      {options.map((item, index) => <div key={index}
                                         className="form-element__multiple form-element__multiple--checkbox">
        <input className="form-element__multiple-input form-element__multiple-input--checkbox"
               checked={selectedItem.indexOf(item) > -1}
               type="checkbox" id={item} name="multiple" value={item}
               onChange={evt => onChangedHandler(evt.target.checked, item)}/>
        <label htmlFor={item}
               className="form-element__multiple-label form-element__multiple-label--checkbox">{item}</label>
      </div>)}
    </div>
  </div>
};

export const Slide = props => {
  const {caption, required, begin, end, min, max, onChange, noBegin} = props;
  const styleBegin = {
    left: `${(begin / max) * 100}%`,
    transform: `translateX(-50%)`
  };
  const styleEnd = {
    left: `${(end / max) * 100}%`,
    transform: `translateX(-50%)`
  };
  const styleBackground = {
    left: `${(begin / max) * 100}%`,
    width: `${((end - begin) / max) * 100}%`
  };
  return <div className="form-group-container__col">
    <label className={`form-group-label ${required ? "form-element__header--required" : ""}`}>{caption}</label>
    <div className="form-element__slider form-element__slider--double">
      {!noBegin &&
      <input className="form-element__slider-input" type="range" name="slider" min={min} max={max} value={begin}
             onChange={evt => onChange(evt.target.value, end)}/>}
      <input className="form-element__slider-input" type="range" name="slider" min={min} max={max} value={end}
             onChange={evt => onChange(begin, evt.target.value)}/>
      <div className="form-element__slider-line form-element__slider-line--double" style={styleBackground}/>
    </div>
    <div className="form-element__slider-labels">
      <span className="form-element__slider-label--min">{min}</span>
      {begin !== min && <span className="form-element__slider-label--value" style={styleBegin}>{begin}</span>}
      {end !== max && <span className="form-element__slider-label--value" style={styleEnd}>{end}</span>}
      <span className="form-element__slider-label--max">{max}</span>
    </div>
  </div>
};

export const Counter = props => {
  const {caption, name, value, onChange} = props;
  return <div className="form-element__counter">
    <label htmlFor="Criminal books" className="form-element__counter-label">{caption}</label>
    <span className="form-element__counter-arrow" onClick={() => onChange(value - 1)}/>
    <input className="form-element__counter-input" type="number" id={name} name={name} value={value} readOnly/>
    <span className="form-element__counter-arrow form-element__counter-arrow--up" onClick={() => onChange(value + 1)}/>
  </div>
};

export const Rating = props => {
  const {caption, ratings, required, star, onChange} = props;

  const onChangeHandler = (checked, item) => {
    onChange(item < star ? item : (checked ? item : -1))
  };

  return <div className="form-group-container__col">
    <label className={`form-group-label ${required ? "form-element__header--required" : ""}`}>{caption}</label>
    <div className="form-element__stars-container">
      {ratings.map((item, index) => <div key={index} className="form-element__stars">
        <input className="form-element__stars-input" type="checkbox" id={item} name="stars" value={item}
               checked={star >= item}
               onChange={(evt) => onChangeHandler(evt.target.checked, item)}/>
        <label htmlFor={item} className="form-element__stars-label"/>
      </div>)}
    </div>
  </div>
}

export const ProgressBar = props => {
  const {percent, step} = props;
  return (
    <div className="form-group-container__col">
      <div className="progress-bar rm-pad-l rm-pad-r">
        <div className="progress-bar__line"><span className="progress-bar__line-step" style={{width: `${percent}%`}}/>
        </div>
        <span>{percent}%</span><span>{step}/4</span>
      </div>
    </div>
  )
}