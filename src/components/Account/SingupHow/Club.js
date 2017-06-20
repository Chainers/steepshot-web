import React, { Component } from 'react';
import { connect } from 'react-redux';
import { signup } from '../../actions/auth';
import Messages from '../../Messages';

class Club extends Component {
  constructor(props) {
    super(props);
    this.state = {
      counrty: '',
      city: '',
      mailIndex: '',
      street: '',
      homeHumber: '',
      phoneNumber: '',
      name: '',
      email: '',
      contactPerson: '',
      site: ''
    };
  }

  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  handleSignup(event) {
    event.preventDefault();
    this.props.dispatch(signup(this.state.name, this.state.email, this.state.password));
  }

  render() {
    return (
      <div className="signup-container">
        <div className="panel">
          <div className="panel-body">
            <Messages messages={this.props.messages}/>
            <form onSubmit={this.handleSignup.bind(this)}>

              <legend>Регистрация</legend>

              <div className="form-group">
                <label htmlFor="country">Страна</label>
                <input type="text" name="country" id="country" placeholder="Страна" autoFocus className="form-control" value={this.state.counrty} onChange={this.handleChange.bind(this)} />
              </div>

              <div className="form-group">
                <label htmlFor="city">Город</label>
                <input type="text" name="city" id="city" placeholder="Город" className="form-control" value={this.state.city} onChange={this.handleChange.bind(this)} />
              </div>

              <div className="form-group">
                <label htmlFor="mailIndex">Почтовый индекс</label>
                <input type="text" name="mailIndex" id="mailIndex" placeholder="Почтовый индекс" className="form-control" value={this.state.mailIndex} onChange={this.handleChange.bind(this)}/>
              </div>

              <div className="form-group">
                <label htmlFor="street">Улица</label>
                <input type="text" name="street" id="street" placeholder="Улица" className="form-control" value={this.state.street} onChange={this.handleChange.bind(this)} />
              </div>

              <div className="form-group">
                <label htmlFor="homeHumber">Номер дома</label>
                <input type="text" name="homeHumber" id="homeHumber" placeholder="Номер дома" className="form-control" value={this.state.homeHumber} onChange={this.handleChange.bind(this)} />
              </div>

              <div className="form-group">
                <label htmlFor="name">Название клуба</label>
                <input type="text" name="name" id="name" placeholder="Название клуба" className="form-control" value={this.state.name} onChange={this.handleChange.bind(this)} />
              </div>

              <div className="form-group">
                <label htmlFor="site">Сайт</label>
                <input type="text" name="site" id="site" placeholder="http://mysite.com" className="form-control" value={this.state.site} onChange={this.handleChange.bind(this)} />
              </div>

              <div className="form-group">
                <label htmlFor="email">E-mail</label>
                <input type="email" name="email" id="email" placeholder="E-mail" className="form-control" value={this.state.email} onChange={this.handleChange.bind(this)} />
              </div>

              <div className="form-group">
                <label htmlFor="phoneNumber">Телефон</label>
                <input type="text" name="email" id="phoneNumber" placeholder="xxx-xxx-xxx-xxx" className="form-control" value={this.state.phoneNumber} onChange={this.handleChange.bind(this)} />
              </div>

              <div className="form-group">
                <label htmlFor="contactPerson">Контактное лицо</label>
                <input type="text" name="contactPerson" id="contactPerson" placeholder="Контактное лицо" className="form-control" value={this.state.contactPerson} onChange={this.handleChange.bind(this)} />
              </div>

              <button type="submit" className="btn btn-success">Далее</button>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    messages: state.messages
  };
};

export default connect(mapStateToProps)(Club);
