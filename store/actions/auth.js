import AsyncStorage from '@react-native-community/async-storage'

export const SIGNUP = 'SIGNUP'
export const LOGIN = 'LOGIN'
export const AUTHENTICATE = 'AUTHENTICATE'
export const LOGOUT = 'LOGOUT'

//let timer

export const authenticate = (userId, token, expiryTime) => {
	return (dispatch) => {
		/* dispatch(setLogoutTimer(expiryTime)) */
		dispatch({ type: AUTHENTICATE, token: token, userId: userId })
	}
}

export const signup = (
	email,
	password,
	passwordConfirm,
	registerError,
	existError,
	didntConfirmedError
) => {
	return async (dispatch) => {
		if (password !== passwordConfirm) {
			throw new Error(didntConfirmedError)
		}

		const response = await fetch(
			'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyDwzIAiaXqBQg3hgBicxeBwlU3Z30KXTpc',
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					email: email,
					password: password,
					returnSecureToken: true,
				}),
			}
		)

		if (!response.ok) {
			const errorResData = await response.json()
			const errorId = errorResData.error.message
			let message = registerError
			if (errorId === 'EMAIL_EXISTS') {
				message = existError
			}
			throw new Error(message)
		}

		const resData = await response.json()

		dispatch({ type: SIGNUP, token: resData.idToken, userId: resData.localId })
		/* dispatch(authenticate(resData.localId, resData.idToken, parseInt(resData.expiresIn) * 1000)) */

		const expirationDate = new Date(new Date().getTime() + parseInt(resData.expiresIn) * 1000)
		saveDataToStorage(resData.idToken, resData.localId, expirationDate, resData.refreshToken)
	}
}

export const login = (email, password, defaultError, wrongPassError, noEmailError) => {
	return async (dispatch) => {
		const response = await fetch(
			'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyDwzIAiaXqBQg3hgBicxeBwlU3Z30KXTpc',
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					email: email,
					password: password,
					returnSecureToken: true,
				}),
			}
		)

		if (!response.ok) {
			const errorResData = await response.json()
			const errorId = errorResData.error.message
			let message = defaultError
			if (errorId === 'INVALID_PASSWORD') {
				message = wrongPassError
			} else if (errorId === 'EMAIL_NOT_FOUND') {
				message = noEmailError
			}
			throw new Error(message)
		}

		const resData = await response.json()

		dispatch({ type: LOGIN, token: resData.idToken, userId: resData.localId })
		/* dispatch(authenticate(resData.localId, resData.idToken, parseInt(resData.expiresIn) * 1000)) */

		const expirationDate = new Date(new Date().getTime() + parseInt(resData.expiresIn) * 1000)
		saveDataToStorage(resData.idToken, resData.localId, expirationDate, resData.refreshToken)
	}
}

export const refreshToken = () => {
	return async () => {
		const userData = JSON.parse(await AsyncStorage.getItem('userData'))

		const response = await fetch(
			'https://securetoken.googleapis.com/v1/token?key=AIzaSyDwzIAiaXqBQg3hgBicxeBwlU3Z30KXTpc',
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					grant_type: 'refresh_token',
					refresh_token: userData.refreshToken,
				}),
			}
		)

		if (!response.ok) {
			const errorResData = await response.json()
			const errorId = errorResData.error.message
			let message = 'При авто-входе произошла ошибка..+'
			if (errorId === 'INVALID_REFRESH_TOKEN') {
				message = 'Не верный токен..'
			} else if (errorId === 'USER_NOT_FOUND') {
				message = 'Такой пользователь не зарегистрирован..'
			} else if (errorId === 'USER_DISABLED') {
				message = 'Пользователь не активен..'
			}
			throw new Error(message)
		}

		const resData = await response.json()

		const expirationDate = new Date(new Date().getTime() + parseInt(resData.expires_in) * 1000)
		saveDataToStorage(resData.idToken, resData.localId, expirationDate, resData.refreshToken)
	}
}

export const resetEmail = (email, resetError, notFoundError) => {
	return async (dispatch) => {
		const response = await fetch(
			'https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=AIzaSyDwzIAiaXqBQg3hgBicxeBwlU3Z30KXTpc',
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					requestType: 'PASSWORD_RESET',
					email: email,
				}),
			}
		)

		if (!response.ok) {
			const errorResData = await response.json()
			const errorId = errorResData.error.message
			let message = resetError
			if (errorId === 'EMAIL_NOT_FOUND') {
				message = notFoundError
			}
			throw new Error(message)
		}
	}
}

export const logout = () => {
	//clearLogoutTimer()
	AsyncStorage.removeItem('userData')
	AsyncStorage.removeItem('userPersonalData')
	return { type: LOGOUT }
}

/* const clearLogoutTimer = () => {
	if (timer) {
		clearTimeout(timer)
	}
} */

const setLogoutTimer = (expirationTime) => {
	return (dispatch) => {
		timer = setTimeout(() => {
			dispatch(logout())
		}, expirationTime / 1000)
	}
}

const saveDataToStorage = (token, userId, expirationDate, refreshToken) => {
	AsyncStorage.setItem(
		'userData',
		JSON.stringify({
			token: token,
			userId: userId,
			expiryDate: expirationDate.toISOString(),
			refreshToken: refreshToken,
		})
	)
}
