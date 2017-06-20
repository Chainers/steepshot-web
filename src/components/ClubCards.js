import React from 'react';
import TableElements from './TableElements';
import LocalizedStrings from './Localization/index.js';
import { connect } from 'react-redux';

class ClubCards extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      localize: LocalizedStrings.getInstance()
    };
  }

  render() {
    return (
      <div className="club-cards">
        <div className="sorting-menu">
          <div>
            <input placeholder={this.state.localize.search}/>
            <button>{this.state.localize.search}</button>
          </div>
          <div>
            <input placeholder={this.state.localize.country} />
            <input placeholder={this.state.localize.city} />
            <div>
              Some filter block
            </div>
            <input placeholder="Метро" />
            <input placeholder="Виды тренировок" />
            <p>{this.state.localize.price}</p>
            <div>
               от <input value="100" /> до <input value="200" />
            </div>
            <p>Срок</p>
            <input placeholder="День"/>
            <p>Checkbox</p>
            <button>{this.state.localize.apply}</button>
          </div>
          <div>
            <p>Wi-fi</p>
            <p>Душ</p>
            <p>Паркинг</p>
          </div>
        </div>
        <div className="output-block">
          <p>Главная / Клубные карты</p>
          <div className="table-block">
            <div className="sortable-table-menu">
              <p>{this.state.localize.price}</p>
            </div>
            {[1,2,3].map(() => {
              return <TableElements />;
            })}
          </div>
        </div>
      </div>
    );
  }
};

const mapStateToProps = (state) => {
  return {
    localization: state.localization
  };
};

export default connect(mapStateToProps)(ClubCards);
