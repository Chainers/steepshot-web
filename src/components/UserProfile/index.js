import Profile from './profile';

const UserProfile = (props) => {
  return (
    <Profile 
      username={props.match.params.username} 
      history={props.history}/>
  );
}

export default UserProfile;
