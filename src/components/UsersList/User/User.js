import React from 'react';
import {Link} from 'react-router-dom';
import Avatar from "../../Common/Avatar/Avatar";
import {connect} from "react-redux";

const User = ({user}) => {

  let amountMoney = '';
  if (user.amount_sbd) {
    amountMoney = '+ $' + user.amount_sbd.toFixed(3);
  }

  return (
    <div className="container_user">
      <Link to={`/@${user.author}`}>
        <Avatar src={user.avatar} style={{width: '60px', height: '60px'}}/>
      </Link>
      <div className="name_user">
        <Link to={`/@${user.author}`}>
          {user.author}
        </Link>
        <span className="money_user">
          {amountMoney}
        </span>
      </div>
      <div className="follow-btn_user">

      </div>
    </div>
  );
};

const mapStateToProps = (state, props) => {
  const user = state.usersList[props.point].users[props.index];

  return {
    user: user ? user : {},
  };
};

const mapDispatchToProps = (dispatch) => {
  return {

  };
};

export default connect(mapStateToProps, mapDispatchToProps)(User);
