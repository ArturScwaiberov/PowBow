import Category from '../../models/categories'

export const SET_CATEGORIES = 'SET_CATEGORIES'

export const fetchCategories = (fetchError) => {
	return async (dispatch, getState) => {
		try {
			const response = await fetch('https://shopapp-6f444.firebaseio.com/categories.json')

			if (!response.ok) {
				throw new Error(fetchError)
			}

			const respData = await response.json()
			const loadedCategories = []

			for (const key in respData) {
				loadedCategories.push(
					new Category(
						key,
						respData[key].title,
						respData[key].titleKg,
						respData[key].imageUrl,
						respData[key].description
					)
				)
			}

			dispatch({
				type: SET_CATEGORIES,
				categories: loadedCategories,
			})
		} catch (err) {
			throw err
		}
	}
}
