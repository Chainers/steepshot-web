import Profile from './profile';

const UserProfile = (props) => {
  return (
    <Profile username={props.match.params.username} />
  );
}

export default UserProfile;
