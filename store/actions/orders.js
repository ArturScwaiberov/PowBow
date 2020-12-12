import Order from '../../models/order'

export const ADD_ORDER = 'ADD_ORDER'
export const SET_ORDERS = 'SET_ORDERS'

export const fetchOrders = (ordersFetchError) => {
	return async (dispatch, getState) => {
		const userId = getState().auth.userId
		try {
			const response = await fetch(`https://shopapp-6f444.firebaseio.com/orders/${userId}.json`)

			if (!response.ok) {
				throw new Error(ordersFetchError)
			}

			const resData = await response.json()
			const loadedOrders = []

			for (const key in resData) {
				loadedOrders.push(
					new Order(
						key,
						resData[key].cartItems,
						resData[key].totalAmount,
						new Date(resData[key].date),
						resData[key].status
					)
				)
			}

			dispatch({ type: SET_ORDERS, orders: loadedOrders })
		} catch (err) {
			throw err
		}
	}
}

export const addOrder = (cartItems, totalAmount, phone, adress, payMethod, orderConfirmError) => {
	return async (dispatch, getState) => {
		const token = getState().auth.token
		const userId = getState().auth.userId
		const date = new Date()
		const status = 'new'
		const response = await fetch(
			`https://shopapp-6f444.firebaseio.com/orders/${userId}.json?auth=${token}`,
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					cartItems,
					totalAmount,
					date: date.toISOString(),
					status,
					phone,
					adress,
					payMethod,
				}),
			}
		)

		const responseOne = await fetch(`https://boredsnowed.altkg.com/admin/orders/add?json=true`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: 'Basic dGVzdDp0ZXN0',
			},
			body: JSON.stringify({
				cartItems,
				totalAmount,
				date: date.toISOString(),
				status,
				phone,
				adress,
				payMethod,
				userId,
			}),
		})

		if (!response.ok) {
			throw new Error(orderConfirmError)
		}

		if (!responseOne.ok) {
			throw new Error(orderConfirmError)
		}

		const resData = await response.json()
		const resDataOne = await responseOne.json()
		console.log(resDataOne)

		dispatch({
			type: ADD_ORDER,
			orderData: {
				id: resData.name,
				items: cartItems,
				amount: totalAmount,
				date: date,
				status: status,
				payMethod,
			},
		})
	}
}

export const toMailOrder = (products, totalAmount, phone, adress, payMethod, sendMailError) => {
	return async (dispatch, getState) => {
		const token = 'Рowpowtoken'
		const response = await fetch(`https://evamall.altkg.com/mail`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				products,
				totalAmount,
				phone,
				adress,
				payMethod,
				token,
			}),
		})

		if (!response.ok) {
			throw new Error(sendMailError)
		}
	}
}
