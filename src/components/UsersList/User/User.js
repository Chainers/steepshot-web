import React from 'react';
import {Link} from 'react-router-dom';
import Avatar from "../../Common/Avatar/Avatar";

const User = ({user}) =>
  <div className="container_user">
    <Link to={`/@${user.author}`}>
      <Avatar src={user.avatar} style={{width: '60px', height: '60px'}}/>
    </Link>
    <div className="name_user">
      <Link to={`/@${user.author}`}>
        {user.author}
      </Link>
    </div>
  </div>
;

export default User;
