import Product from '../../models/product'

export const DELETE_PRODUCT = 'DELETE_PRODUCT'
export const CREATE_PRODUCT = 'CREATE_PRODUCT'
export const UPDATE_PRODUCT = 'UPDATE_PRODUCT'
export const SET_PRODUCTS = 'SET_PRODUCTS'

export const fetchProducts = () => {
	return async (dispatch, getState) => {
		const userId = getState().auth.userId
		try {
			const response = await fetch('https://shopapp-6f444.firebaseio.com/products.json')

			if (!response.ok) {
				throw new Error('Something went wrong when we recieve data..')
			}

			const respData = await response.json()
			const loadedProducts = []

			for (const key in respData) {
				loadedProducts.push(
					new Product(
						key,
						respData[key].ownerId,
						respData[key].title,
						respData[key].imageUrl,
						respData[key].description,
						respData[key].price,
						respData[key].category
					)
				)
			}
			dispatch({
				type: SET_PRODUCTS,
				products: loadedProducts,
				userProducts: loadedProducts.filter((prod) => prod.ownerId === userId),
			})
		} catch (err) {
			throw err
		}
	}
}

export const deleteProduct = (productId) => {
	return async (dispatch, getState) => {
		const token = getState().auth.token
		const response = await fetch(
			`https://shopapp-6f444.firebaseio.com/products/${productId}.json?auth=${token}`,
			{
				method: 'DELETE',
			}
		)

		if (!response.ok) {
			throw new Error('При удалении возникла ошибка..')
		}

		dispatch({ type: DELETE_PRODUCT, pid: productId })
	}
}

export const createProduct = (title, imageUrl, price, description, category) => {
	return async (dispatch, getState) => {
		const token = getState().auth.token
		const userId = getState().auth.userId
		const response = await fetch(
			`https://shopapp-6f444.firebaseio.com/products.json?auth=${token}`,
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					title,
					imageUrl,
					price,
					description,
					category,
					ownerId: userId,
				}),
			}
		)

		if (!response.ok) {
			throw new Error('При добавлении продукта возникла ошибка...')
		}

		const respData = await response.json()

		dispatch({
			type: CREATE_PRODUCT,
			productData: {
				id: respData.name,
				title,
				imageUrl,
				price,
				description,
				category,
				ownerId: userId,
			},
		})
	}
}

export const updateProduct = (id, title, imageUrl, price, description, category) => {
	return async (dispatch, getState) => {
		const token = getState().auth.token
		const response = await fetch(
			`https://shopapp-6f444.firebaseio.com/products/${id}.json?auth=${token}`,
			{
				method: 'PATCH',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					title,
					imageUrl,
					price,
					description,
					category,
				}),
			}
		)

		if (!response.ok) {
			throw new Error('Возникла ошибка при обновлении...')
		}

		dispatch({
			type: UPDATE_PRODUCT,
			pid: id,
			productData: { title, imageUrl, price, description, category },
		})
	}
}
