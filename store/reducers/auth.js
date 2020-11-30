import { LOGIN, SIGNUP, AUTHENTICATE, LOGOUT } from '../actions/auth'
import { SET_USER_DATA, CREATE_USER, UPDATE_USER } from '../actions/users'
import { combineReducers } from 'redux'

const initialState = {
	token: null,
	userId: null,
	isAuth: false,
	userSelfData: [],
}

export default (state = initialState, action) => {
	switch (action.type) {
		case AUTHENTICATE:
			return {
				...state,
				token: action.token,
				userId: action.userId,
				isAuth: true,
			}
		case SET_USER_DATA:
			return { ...state, userSelfData: action.userData }
		case UPDATE_USER:
			return {
				...state,
				userSelfData: {
					...state.userSelfData,
					phone: action.userData.phone,
					adress: action.userData.adress,
				},
			}

		case CREATE_USER:
			return { ...state, userSelfData: action.userData }
		case LOGIN:
			return {
				...state,
				token: action.token,
				userId: action.userId,
				isAuth: true,
			}
		case SIGNUP:
			return {
				...state,
				token: action.token,
				userId: action.userId,
				isAuth: true,
			}
		case LOGOUT:
			return initialState
		default:
			return state
	}
}
