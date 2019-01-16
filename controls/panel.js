import React from 'react'

// import {OverlayBackground, PopupButton1, PopupButton2, PopupButtons, PopupPanel} from "../../styles/popup";

export class GoBackConfirmModal extends React.Component {
  render() {
    if (this.state.show) {
      return <PopUp title={`Are you sure want to go back?`}
                    content={'Changes you made may not be saved.'}
                    buttons={[{
                      caption: 'No',
                      action: this.onConfirmGoBack.bind(this, false)
                    }, {
                      caption: 'Yes',
                      action: this.onConfirmGoBack.bind(this, true),
                      primary: true
                    }]}/>
    }
    return (<div/>)
  }

  constructor(props) {
    super(props);

    this.state = {
      show: props.show
    }
  }

  componentWillReceiveProps(props) {
    this.setState({
      show: props.show
    })
  }

  onConfirmGoBack(confirm) {
    if (this.props.onConfirmGoBack) {
      this.props.onConfirmGoBack(confirm);
    }

    if (confirm) {
      window.navGoBack();
    } else {
      this.setState({
        show: false
      })
    }
  }
}

export const FatalError = (errorId) => {
  const btnExit = {
    caption: 'Exit',
    action: () => window.navGoBack()
  };
  return <PopUp title="Data Error" buttons={[btnExit]}
                content={`An error was thrown when fetching or saving data.  Please exit the form and refresh the the job details page to refresh this form.  Error id: ${errorId}`}/>
};

export const PopUp = props => {
  const {title, content, buttons} = props;
  return (
    <div className="dialog-overlay dialog-overlay--visible">
      <div className="dialog"><h2 className="dialog__header"><span
        className="dialog__header-label">{title}</span></h2>
        <div className="dialog__content">
          <div>{content}</div>

          {buttons.length > 0 && <div className="dialog__buttons">
            {buttons.map((button, index) => {
              if (button.primary) {
                return <span key={index} className="image-upload-dialog__upload-container">
                  <div onClick={(evt) => button.action(evt)}
                       className="btn btn--block btn--green rm-margin-t">{button.caption}</div></span>
              }
              return <button key={index} className="btn btn--white dialog__cancel-btn rm-margin-t"
                             style={{border: 'none'}} onClick={(evt) => button.action(evt)}>{button.caption}</button>
            })}
          </div>}
        </div>
      </div>
    </div>
  )
};

export class GoBackConfirmModal2 extends React.Component {
  render() {
    return (
      <div className={`modal ${this.state.show && 'active'}`}>
        <div className="prompt">
          <div className="prompt-header">Are you sure want to go back?</div>
          <div className="prompt-body">
            <p className="pad-b">Changes you made may not be saved.</p>
            <button type="button" className="btn btn-green" onClick={this.onConfirmGoBack.bind(this, true)} tabIndex="0">
              <i className="sk sk-check"/> Yes
            </button>
            <button type="button" className="btn btn-red" onClick={this.onConfirmGoBack.bind(this, false)} tabIndex="0">
              <i className="sk sk-close"/> No
            </button>
          </div>
        </div>
      </div>)
  }

  constructor(props) {
    super(props);

    this.state = {
      show: props.show
    }
  }

  componentWillReceiveProps(props) {
    this.setState({
      show: props.show
    })
  }

  onConfirmGoBack(confirm) {
    if (this.props.onConfirmGoBack) {
      this.props.onConfirmGoBack(confirm);
    }

    if (confirm) {
      window.navGoBack();
    } else {
      this.setState({
        show: false
      })
    }
  }
}

export class PhotoPanel extends React.Component {
  render() {
    return (
      <div>
        <div className="list">
          <div className="list-item">
            <img src={this.props.attachment} alt=""/>
          </div>
          <Textbox caption="Caption" value={this.state.caption} dirty={this.state.dirty} onValueChanged={this.captionChanged.bind(this)} required={true}/>
          <div className="list-item">
            <button className="btn btn-green col-6" onClick={this.onSave.bind(this)}>Save</button>
            <button className="btn btn-red col-6" onClick={this.onCancel.bind(this)}>Cancel</button>
          </div>
        </div>
      </div>
    )
  }

  constructor(props) {
    super(props);

    this.state ={
      caption: props.caption,
      dirty: false
    };
  }

  componentWillReceiveProps(props) {
    this.setState({
      caption: props.caption,
      dirty: false
    });
  }

  captionChanged(val) {
    this.setState({
      dirty: true,
      caption: val
    });
  }

  onSave() {
    if (this.props.onCaptionChanged) {
      this.props.onCaptionChanged(this.state.caption)
    }
  }

  onCancel() {
    this.props.cancelImage()
  }
}

export class SignaturePanel extends React.Component {
  render() {
    return (
      <div>
        <div className="list-item">
          <span className="label" style={{ lineHeight: '50px' }}>{this.props.caption}</span>
          <span className="field hasRightBtn">
            <button className="btn btn-green" style={{ right: '16px', position: 'absolute' }} onClick={evt => this.clickHandler(evt)}>
              <i className="sk sk-sig"></i> Sign</button>
          </span>
        </div >
        <div className="list-item text-center">
          {!this.state.clientSig && <div className="no-results">No Signature</div>}
          {!!this.state.clientSig && <img className="signature-img" src={this.state.clientSig} />}
        </div>
      </div>
    )
  }

  constructor(props) {
    super(props)

    this.state = {
      clientSig: props.clientSig
    }
  }

  clickHandler(evt) {
    this.props.widgets.SignaturePanel().then(sign => {
      this.setState({
        clientSig: sign
      })

      if (this.props.onValueChanged) {
        this.props.onValueChanged(sign)
      }
    })
  }
}

export class NoResult extends React.Component {
  render() {
    const noResult = {
      textAlign: 'center',
      color: '#cecece',
      fontSize: '17.5px',
      padding: '10px 0',
      minHeight: 'inherit'
    };

    return <div style={noResult}>{this.props.message || 'No results found'}</div>;
  }
}

export class ItemPanels extends React.Component {
  render() {
    return (
      <div className="list list-details">
        <div className="list-item">
          <div className="searchbox search-height-46">
            <input type="text" placeholder="Search" value={this.state.term} onChange={(evt) => this.onSearchTermChanged(evt)} style={{ paddingLeft: 0 }} />
            <button type="submit" className="add-on"><i className="sk sk-search"/></button>
          </div>
        </div>
        {this.state.options.map((item, idx) => (
          <div key={idx} className="list-item hasArrow" onClick={(evt) => this.onItemSelected(item)}>
            <span className="">{item[this.props.nameValue]}</span>
          </div>))
        }
      </div>
    )
  }

  constructor(props) {
    super(props)
    this.state = {
      term: '',
      options: props.options
    }
  }

  onSearchTermChanged(evt) {
    const term = evt.target.value
    this.setState({
      term: term,
      options: _.filter(this.props.options, item => item[this.props.nameValue].indexOf(term) > -1)
    })
  }

  onItemSelected(item) {
    if (this.props.onLookupItemSelected) {
      this.props.onLookupItemSelected(item)
    }

    this.goback()
  }

  goback() {
    if (this.props.onGoback) {
      this.props.onGoback()
    }
  }
}
