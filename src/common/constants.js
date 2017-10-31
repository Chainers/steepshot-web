export default {
    POST_FILTERS: {
        TRENDING: 'Top',
        HOT: 'Hot',
        NEW: 'New'
    },
    URLS: {
        baseUrl_v1_1: 'https://steepshot.org/api/v1_1',
        baseUrl_v1: 'https://steepshot.org/api/v1',
        baseUrlPost: 'https://steepshot.org/post'
    },
    CATEGORIES: {
        user: 'user',
        tag: 'tag'
    },
    OPERATIONS: {
        COMMENT: 'comment',
        VOTE: 'vote',
        POST: 'post',
        FOLLOW: 'follow',
        COMMENT_OPTIONS: 'comment_options',
        FLAG: 'flag'
    },
    STEEM_PATLOAD: {
        MAX_ACCEPTED_PAYOUT: '1000000.000 SBD',
        PERCENT_STEMM_DOLLARS: 10000
    },
    NO_AVATAR: '/static/images/person.png',
    NO_IMAGE: '/static/images/noimage.jpg',

    SETTINGS: {
        show_low_rated : "show_low_rated",
        show_nsfw : "show_nsfw"
    },

    SETTINGS_LABELS : {
        save : 'Save',
        succesSave : 'Saved',
        upToDate : 'Already up to date'
    },

    POSTS_SETTINGS: {
        defaultLimit: 16
    },

    POSTS_POINTS : {
        POSTS_NEW : 'posts/new',
        POSTS_TOP : 'posts/top',
        POSTS_HOT : 'posts/hot',
        POSTS_USER_FEED : 'recent/posts'
    },

    PROMISES : {
        GET_COMMENTS : 'GET_COMMENTS_PROMISE',
        GET_POSTS : 'GET_POSTS_PROMISE',
        GET_FOLLOWERS : 'GET_FOLLOWERS_PROMISE',
        GET_FOLLOWING : 'GET_FOLLOWING_PROMISE'
    },

    CURRENCY: '$'
}
