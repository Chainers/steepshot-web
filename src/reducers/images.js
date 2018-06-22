import Constants from '../common/constants';

const defaultAvaSize = Constants.DEF_AVATAR_SIZE;
const userCardAvaSize = Constants.USER_CARD_AVATAR_SIZE;
const userProfAvaSize = Constants.USER_PROFILE_AVATAR_SIZE;

const defaultPostSize = Constants.DEF_POST_SIZE;

export default function images(state = {}, action) {
  switch (action.type) {

    case 'ADD_IMAGE_LINK':
      return {
        ...state,
        ...action.imageLink
      };

    case 'GET_POSTS_LIST_SUCCESS':
      let proxysUrls = {};
      for (let url in action.posts) {
        let postUrl = action.posts[url].media[0].url || action.posts[url].body;
        let avatarUrl = action.posts[url].avatar;
        proxysUrls[postUrl] = {
          [defaultPostSize]: `https://steemitimages.com/${2 * defaultPostSize}x${2 * defaultPostSize}/` + postUrl
        };
        proxysUrls[avatarUrl] = {
          [defaultAvaSize]: `https://steemitimages.com/${2 * defaultAvaSize}x${2 * defaultAvaSize}/` + avatarUrl,
          [userCardAvaSize]: `https://steemitimages.com/${2 * userCardAvaSize}x${2 * userCardAvaSize}/` + avatarUrl,
          [userProfAvaSize]: `https://steemitimages.com/${2 * userProfAvaSize}x${2 * userProfAvaSize}/` + avatarUrl,
        }
      }
      return {
        ...state,
        ...proxysUrls
      };

    case 'GET_USERS_LIST_SUCCESS':
      let proxysAvaUrls = {};
      for (let user in action.users) {
        let avatarUrl = action.users[user].avatar;
        proxysAvaUrls[avatarUrl] = {
          [defaultAvaSize]: `https://steemitimages.com/${2 * defaultAvaSize}x${2 * defaultAvaSize}/` + avatarUrl,
          [userCardAvaSize]: `https://steemitimages.com/${2 * userCardAvaSize}x${2 * userCardAvaSize}/` + avatarUrl,
          [userProfAvaSize]: `https://steemitimages.com/${2 * userProfAvaSize}x${2 * userProfAvaSize}/` + avatarUrl,
        }
      }
      return {
        ...state,
        ...proxysAvaUrls
      };

    case 'LOGIN_SUCCESS':
      let avatarHeaderUrl = action.avatar;
      let proxyHeaderAvaUrl = {
        [avatarHeaderUrl]: {
          [defaultAvaSize]: `https://steemitimages.com/${2 * defaultAvaSize}x${2 * defaultAvaSize}/` + avatarHeaderUrl,
          [userCardAvaSize]: `https://steemitimages.com/${2 * userCardAvaSize}x${2 * userCardAvaSize}/` + avatarHeaderUrl,
          [userProfAvaSize]: `https://steemitimages.com/${2 * userProfAvaSize}x${2 * userProfAvaSize}/` + avatarHeaderUrl,
        }
      };
      return {
        ...state,
        ...proxyHeaderAvaUrl
      };

    default:
      return state;
  }
}