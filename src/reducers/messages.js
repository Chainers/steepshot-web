export default function messages(state = {}, action) {
	switch (action.type) {
		case 'LOGIN_FAILURE':
		case 'SIGNUP_FAILURE':
		case 'UPDATE_PROFILE_FAILURE':
		case 'CHANGE_PASSWORD_FAILURE':
		case 'FORGOT_PASSWORD_FAILURE':
		case 'RESET_PASSWORD_FAILURE':
		case 'CONTACT_FORM_FAILURE':
		case 'PAYMENT_FAILURE':
		case 'TRANSFER_FAILURE':
		case 'OAUTH_FAILURE':
		case 'UNLINK_FAILURE':
		case 'LINK_FAILURE':
		case 'CREATE_CARD_FAIL':
		case 'CREATE_BILL_FAIL':
		case 'ADD_CARD_FAILURE':
		case 'REMOVE_CARD_FAILURE':
			return {
				error: action.messages
			};
		case 'UPDATE_PROFILE_SUCCESS':
		case 'CHANGE_PASSWORD_SUCCESS':
		case 'RESET_PASSWORD_SUCCESS':
		case 'CONTACT_FORM_SUCCESS':
		case 'PAYMENT_SUCCESS':
		case 'TRANSFER_SUCCESS':
		case 'CREATE_CARD_SUCCESS':
		case 'CREATE_BILL_SUCCESS':
		case 'ADD_CARD_SUCCESS':
		case 'REMOVE_CARD_SUCCESS':
			return {
				success: action.messages
			};
		case 'FORGOT_PASSWORD_SUCCESS':
		case 'DELETE_ACCOUNT_SUCCESS':
		case 'UNLINK_SUCCESS':
			return {
				info: action.messages
			};
		case 'CLEAR_MESSAGES':
			return {};
		default:
			return state;
	}
}
