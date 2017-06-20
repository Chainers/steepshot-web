import React from 'react';

class TableElements extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="table-element">
        <div className="image">
        </div>
        <div className="info-block">
          <div className="header">
            <div className="name">Олимп</div>
            <div className="street">улица.....</div>
          </div>
          <div className="main-block">
            <div className="top-info">
              <div className="price">236 руб/8 занятий</div>
              <div className="social-info">Facebook</div>
            </div>
            <div className="description">Lorem ....</div>
            <div className="additional-options">
              <div>Wi-fi</div>
            </div>
            <div className="link-to">Узнать больше</div>
          </div>
        </div>
      </div>
    );
  }
};

export default TableElements;
