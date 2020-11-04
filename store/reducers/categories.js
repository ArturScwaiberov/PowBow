import { SET_CATEGORIES } from '../actions/categories'
import Categories from '../../models/categories'

const initialState = {
	availableCategories: [],
}

export default (state = initialState, action) => {
	switch (action.type) {
		case SET_CATEGORIES:
			return {
				...state,
				availableCategories: action.categories,
			}
	}
	return state
}
