import React from 'react'
import _ from 'lodash'

export class Table extends React.Component {
  /*
    <Table
      header={["First Col", "Second Col"]}
      datasource={[{"First Col": "aaa", "Second Col": "bbb"}]}
      buttons=[{
        caption: "Remove",
        action: () => {}
      }]
    />
   */
  render() {
    let style = {
      body: {
        borderTop: '0',
        borderBottom: '1px solid #ddd'
      }
    };

    let header = this.props.header.slice();

    if (this.props.buttons && this.props.buttons.length) {
      header.push("");
    }

    header.forEach((item, index) => {
      style[`col-${index}`] = {
        width: `${100/header.length}%`
      }
    });

    return (
      <div>
        <table className="table table-bordered">
          <thead>
          <tr>
            {header.map((item, index) => {
              return <th style={style[`col-${index}`]} key={index}>{item || ' '}</th>
            })}
          </tr>
          </thead>
        </table>
        {this.props.datasource.length === 0 && <NoResult/>}
        {this.props.datasource.length > 0 && <table className="table" style={style.body}>
          <tbody>
          {this.props.datasource.map((row, rowIdx) => {
            let rowData = this.props.header.map((col, colIdx) => {
              return <td style={style[`col-${colIdx}`]} key={colIdx}>{row[col]}</td>
            });

            if (this.props.buttons && this.props.buttons.length) {
              const visibleButtons = _.filter(this.props.buttons, btn => {
                if (typeof btn.visible === 'function') return btn.visible(row);
                if (typeof btn.visible === 'undefined') return true;
                return btn.visible;
              });
              rowData.push(<td key={header.length}>
                {visibleButtons.map((btn, btnIdx) => {
                  return <a href="javascript:;" key={`btn-${btnIdx}`} style={{paddingRight: "15px"}} onClick={btn.action.bind(this, row)}>{btn.caption}</a>
                })}
              </td>)
            }

            return <tr key={rowIdx}>{rowData}</tr>;
          })}
          </tbody>
        </table>}
      </div>
    )
  }
}

export class Table2 extends React.Component {
  /*
    const onClick = (row) => {
      console.log(row)
    }

    const columns =  [
      { displayName: 'CER Name', field: 'Name' },
      { displayName: 'Location Name', field: 'CERLocationName' },
      { displayName: 'CNC Name', field: 'CNCName' },
      { displayName: 'CER Start Date', field: 'StartTime' },
      {
        displayName: '', field: '', width: 50,
        template: <i className="sk sk-chevron-right"/>,
        onClick: (row) => { onClick(row) }
      }
    ];

    return (
     <Table2
       columns={columns}
       datasource={recurringSchedules}
    />
    )
   */
  render() {
    let style = {
      body: {
        borderTop: '0',
        borderBottom: '1px solid #ddd'
      }
    };

    const fixedWidth = _.reduce(this.props.columns, (result, item) => result + (item.width || 0), 0);
    const fixWidthNum = _.reduce(this.props.columns, (result, item) => result + (item.width ? 1 : 0), 0);

    this.props.columns.forEach((item, index) => {
      style[`col-${index}`] = {
        width: item.width ? `${item.width}px` : `calc((100vw - ${fixedWidth}px) / ${this.props.columns.length - fixWidthNum})`
      }
    });

    return (
      <div>
        <table className="table table-bordered">
          <thead>
          <tr>
            {this.props.columns.map((item, index) =><th style={style[`col-${index}`]} key={index}>{item.displayName || ' '}</th>)}
          </tr>
          </thead>
        </table>
        {this.props.datasource.length === 0 && <NoResult/>}
        {this.props.datasource.length > 0 && <table className="table" style={style.body}>
          <tbody>
          {this.props.datasource.map((row, rowIdx) => {
            let rowData = this.props.columns.map((col, colIdx) => {
              let options = {
                style: _.assign(style[`col-${colIdx}`], col.cssStyle || {}),
                key: colIdx,
                onClick: () => col.onClick && col.onClick(row)
              };

              if (!col.template) {
                return <td {...options}>{row[col.field]}</td>
              }
              return <td {...options}>{col.template}</td>
            });
            return <tr key={rowIdx}>{rowData}</tr>;
          })}
          </tbody>
        </table>}
      </div>
    )
  }
}
