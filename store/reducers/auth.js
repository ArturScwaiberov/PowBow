import { /* LOGIN, SIGNUP */ AUTHENTICATE, LOGOUT } from '../actions/auth'

const initialState = {
	token: null,
	userId: null,
	isAuth: false,
}

export default (state = initialState, action) => {
	switch (action.type) {
		case AUTHENTICATE:
			return {
				token: action.token,
				userId: action.userId,
				isAuth: true,
			}
		case LOGOUT:
			return initialState
		/* case LOGIN:
			return {
				token: action.token,
				userId: action.userId,
				isAuth: true,
			}
		case SIGNUP:
			return {
				token: action.token,
				userId: action.userId,
				isAuth: true,
			} */
		default:
			return state
	}
}
