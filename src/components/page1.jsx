import React from 'react';
import {
  Counter,
  ImageUpload,
  ListRadioInline,
  MultiPicklist,
  PopUp,
  ProgressBar,
  Rating,
  Select,
  Slide,
  Text,
  Textarea,
  Textbox,
  Toggle,
  DateTimeSelect,
  AddressAutoComplete
} from "../../controls";

import {VIEW_DETAIL} from './duck/type'

export default class Page1 extends React.Component {
  constructor(props) {
    super(props);
    this.const = {
      view_main: 0,
      view_showPopUp: 1
    };
    this.state = {
      view: this.const.view_main,
      preview: '',
      counter1: 0,
      counter2: 1,
      begin: 50,
      end: 100,
      end2: 20,
      Start: null
    }
  }

  render() {

    return (
      <div className={"content-section"}>
        <div className={this.state.view === this.const.view_showPopUp ? " blur_bg " : ""}>
          <h1>Kitchen sink</h1>

          <ProgressBar percent={25} step={1}/>

          <Textbox caption={"First Name"} value={this.state.firstName} placeholder={"First Name"}
                   onChange={val => this.setState({firstName: val})}/>
          <Textbox caption={"Last Name"} value={this.state.lastName} placeholder={"Last Name"}
                   onChange={val => this.setState({lastName: val})}/>
          <Textbox caption={"Birthday"} type="date" value={this.state.birthday} placeholder={"Enter your birthday"}
                   onChange={val => this.setState({birthday: val})}/>
          <AddressAutoComplete caption={"Location"} value={this.state.Address}
                  types={['address', 'establishment']}
                  onAddressSelected={(location) => {
                    const {formatted_address, geometry} = location;
                    const {lat, lng} = geometry.location;
                    console.log(lat(), lng());
                    this.setState({Address: formatted_address})
                  }}/>
          <DateTimeSelect value={this.state.Start} required={true} onChange={val => this.setState('Start',  val)} />
          <Select caption={"Gender"} value={this.state.gender} options={["Male", "Female"]}
                  placeholder={"Select Gender"}
                  onChange={val => this.setState({gender: val})}/>
          <Toggle caption={"Active"} value={this.state.active} onChange={val => this.setState({active: val})}/>
          <Textarea caption={"Notes"} value={this.state.notes} placeholder={"Enter notes"}
                    onChange={val => this.setState({notes: val})}/>
          <ImageUpload action={this.onSignatureAction.bind(this)} className="pad-t" preview={this.state.preview}
                       clear={() => this.setState({preview: ''})}/>
          <ListRadioInline caption="Number of Items" value={this.state.numberOfItem} options={[1, 2, 3, 4, 5, 6]}
                           onChange={val => this.setState({numberOfItem: val})}/>
          <Rating caption="Rating of this template" required ratings={[1, 2, 3, 4, 5]}
                  star={this.state.rating} onChange={rating => this.setState({rating})}/>
          <MultiPicklist caption="Multi-picklist"
                         value={this.state.multiPicklist}
                         onChange={val => this.setState({multiPicklist: val})}
                         options={["Blue", "Orange", "Green", "Purple", "Red"]}/>

          <div className="form-group-container__col">
            <label className="form-group-label">Multi Counter</label>
            <div className="form-element__counter-container">
              <Counter caption={"Counter 1"} value={this.state.counter1} name="counter-1"
                       onChange={val => this.setState({counter1: val})}/>
              <Counter caption={"Counter 2"} value={this.state.counter2} name="counter-2"
                       onChange={val => this.setState({counter2: val})}/>
            </div>
          </div>

          <Slide caption="Select begin / end" required min={0} max={200}
                 onChange={(begin, end) => this.setState({begin, end})}
                 begin={this.state.begin} end={this.state.end}/>
          <Slide caption="Select begin / end" required min={0} max={200} noBegin
                 onChange={(begin, end2) => this.setState({end2})}
                 begin={0} end={this.state.end2}/>

          <div className="btn-group-2 pad-t">
            <button className={"btn btn--block btn--green"} onClick={this.onClickHandler.bind(this)}>Page 2</button>
            <button className="btn btn--block btn--green rm-margin-t"
                    onClick={() => this.setState({view: this.const.view_showPopUp})}>Show PopUp
            </button>
          </div>

          <div className="sticky-button">
            <button className="btn btn--green sticky-list-actions__btn sticky-list-actions__btn--add" onClick={() => {
            }}/>
          </div>

          {/*<div className="sticky-button">*/}
          {/*<button className="btn btn--green sticky-list-actions__btn sticky-list-actions__btn--edit" onClick={() => {}}/>*/}
          {/*</div>*/}

        </div>

        {this.state.view === this.const.view_showPopUp && <PopUp title="Demo popup"
                                                                 content={`Once a Support Note is marked as "Complete" it is no longer able to be edited. Are you sure you wish to continue?`}
                                                                 buttons={[{
                                                                   action: () => this.setState({view: this.const.view_main}),
                                                                   caption: 'Go Back'
                                                                 }, {
                                                                   primary: true,
                                                                   action: () => this.setState({view: this.const.view_main}),
                                                                   caption: 'Yes'
                                                                 }]}/>}
      </div>
    )
  }

  onClickHandler() {
    this.props.setView(VIEW_DETAIL)
  }

  onSignatureAction() {
    const {TakePhoto, GetFromGalleryMulti, SignaturePanel, GetFromGallery} = this.props.widgets;
    const $this = this;
    SignaturePanel(function () {
      if ($this.state.preview) {
        this.fromDataURL($this.state.preview)
      }
    }).then(sign => this.setState({preview: sign}))
  }
}
