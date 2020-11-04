import AsyncStorage from '@react-native-community/async-storage'

/* export const SIGNUP = 'SIGNUP'
export const LOGIN = 'LOGIN' */
export const AUTHENTICATE = 'AUTHENTICATE'
export const LOGOUT = 'LOGOUT'

let timer

export const authenticate = (userId, token, expiryTime) => {
	return (dispatch) => {
		/* dispatch(setLogoutTimer(expiryTime)) */
		dispatch({ type: AUTHENTICATE, token: token, userId: userId })
	}
}

export const signup = (email, password) => {
	return async (dispatch) => {
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
			let message = 'При регистрации произошла ошибка..'
			if (errorId === 'EMAIL_EXISTS') {
				message = 'Этот адрес уже используется..'
			}
			throw new Error(message)
		}

		const resData = await response.json()

		/* dispatch({ type: SIGNUP, token: resData.idToken, userId: resData.localId }) */
		dispatch(authenticate(resData.localId, resData.idToken, parseInt(resData.expiresIn) * 1000))

		const expirationDate = new Date(new Date().getTime() + parseInt(resData.expiresIn) * 1000)
		saveDataToStorage(resData.idToken, resData.localId, expirationDate)
	}
}

export const login = (email, password) => {
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
			let message = 'При входе произошла ошибка..'
			if (errorId === 'INVALID_PASSWORD') {
				message = 'Введенный пароль не подходит..'
			} else if (errorId === 'EMAIL_NOT_FOUND') {
				message = 'Такой адрес не зарегистрирован..'
			}
			throw new Error(message)
		}

		const resData = await response.json()

		/* dispatch({ type: LOGIN, token: resData.idToken, userId: resData.localId }) */
		dispatch(authenticate(resData.localId, resData.idToken, parseInt(resData.expiresIn) * 1000))

		const expirationDate = new Date(new Date().getTime() + parseInt(resData.expiresIn) * 1000)
		saveDataToStorage(resData.idToken, resData.localId, expirationDate)
	}
}

export const logout = () => {
	clearLogoutTimer()
	AsyncStorage.removeItem('userData')
	return { type: LOGOUT }
}

const clearLogoutTimer = () => {
	if (timer) {
		clearTimeout(timer)
	}
}

const setLogoutTimer = (expirationTime) => {
	return (dispatch) => {
		timer = setTimeout(() => {
			dispatch(logout())
		}, expirationTime / 1000)
	}
}

const saveDataToStorage = (token, userId, expirationDate) => {
	AsyncStorage.setItem(
		'userData',
		JSON.stringify({
			token: token,
			userId: userId,
			expiryDate: expirationDate.toISOString(),
		})
	)
}
