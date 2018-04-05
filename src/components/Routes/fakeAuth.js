import {
	getStore
} from '../../store/configureStore';

let store = getStore();

const fakeAuth = {
	isAuthenticated: (store.getState().auth.user && store.getState().auth.postingKey) || false,
	authenticate(cb) {
		this.isAuthenticated = true;
		setTimeout(cb, 100) // fake async
	},
	signout(cb) {
		this.isAuthenticated = false;
		setTimeout(cb, 100)
	}
};

export default fakeAuth;