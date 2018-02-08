import React from 'react';
import {Link} from 'react-router-dom';
import Avatar from "../../Common/Avatar/Avatar";
import {connect} from "react-redux";
import {toggleFollow} from "../../../actions/follow";
import ShowIf from "../../Common/ShowIf";
import LoadingSpinner from "../../LoadingSpinner";

const User = ({user, toggleFollow}) => {

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
      <ShowIf show={!user.togglingFollow}>
        <div className="follow-btn_user" onClick={() => toggleFollow(user.author)}>
          <img src={user.has_followed ?
            '/static/images/user/unfollow-button.svg' :
            '/static/images/user/follow-button.svg'} alt="toggle follow"/>
        </div>
      </ShowIf>
      <ShowIf show={user.togglingFollow}>
        <div className="spinner_user">
          <LoadingSpinner/>
        </div>
      </ShowIf>

    </div>
  );
};

const mapStateToProps = (state, props) => {
  const user = state.users[props.index];
  return {
    user: user ? user : {},
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    toggleFollow: (author) => {
      dispatch(toggleFollow(author));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(User);
