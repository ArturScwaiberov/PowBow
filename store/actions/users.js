import AsyncStorage from '@react-native-community/async-storage'
import User from '../../models/user'

export const CREATE_USER = 'CREATE_USER'
export const SET_USER_DATA = 'SET_USER_DATA'
export const UPDATE_USER = 'UPDATE_USER'

export const fetchUserData = () => {
	return async (dispatch, getState) => {
		const userId = getState().auth.userId

		try {
			const response = await fetch(`https://shopapp-6f444.firebaseio.com/users.json`)

			if (!response.ok) {
				throw new Error('При получении информации пользователя произошла ошибка...')
			}

			const respData = await response.json()
			const loadedData = []

			for (const key in respData) {
				loadedData.push(
					new User(
						key,
						respData[key].id,
						respData[key].email,
						respData[key].phone,
						respData[key].adress,
						respData[key].role
					)
				)
			}

			dispatch({ type: SET_USER_DATA, userData: loadedData.filter((user) => user.id === userId) })
		} catch (err) {
			throw err
		}
	}
}

export const createUser = (email) => {
	return async (dispatch, getState) => {
		const token = getState().auth.token
		const userId = getState().auth.userId
		const role = 'user'
		const phone = ''
		const adress = ''
		const response = await fetch(`https://shopapp-6f444.firebaseio.com/users.json?auth=${token}`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				id: userId,
				email,
				role,
				phone,
				adress,
			}),
		})

		if (!response.ok) {
			throw new Error('При создании юзера произошла ошибка...')
		}

		const respData = await response.json()

		dispatch({
			type: CREATE_USER,
			userData: {
				catId: respData.name,
				id: userId,
				email,
				role,
			},
		})

		saveDataToStorage(respData.name, userId, email, role, phone, adress)
	}
}

export const updateUser = (catId, phone, adress) => {
	return async (dispatch, getState) => {
		const token = getState().auth.token
		const response = await fetch(
			`https://shopapp-6f444.firebaseio.com/users/${catId}.json?auth=${token}`,
			{
				method: 'PATCH',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					phone,
					adress,
				}),
			}
		)

		if (!response.ok) {
			throw new Error('Возникла ошибка при обновлении пользовательских данных')
		}

		dispatch({
			type: UPDATE_USER,
			userData: { phone, adress },
		})
	}
}

const saveDataToStorage = (userCatId, id, email, role, phone, adress) => {
	AsyncStorage.setItem(
		'userPersonalData',
		JSON.stringify({
			userCatId,
			id,
			email,
			role,
			phone,
			adress,
		})
	)
}
