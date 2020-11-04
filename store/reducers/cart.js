import { ADD_TO_CART, REMOVE_FROM_CART, REDUCE_FROM_CART, APPEND_TO_CART } from '../actions/cart'
import CartItem from '../../models/cart-item'
import { ADD_ORDER } from '../actions/orders'
import { DELETE_PRODUCT } from '../actions/products'

const initialState = {
	items: {},
	totalAmount: 0,
}

export default (state = initialState, action) => {
	switch (action.type) {
		case ADD_TO_CART:
			const addedProduct = action.product
			const prodPrice = addedProduct.price
			const prodTitle = addedProduct.title

			let updatedOrNewCartItem

			if (state.items[addedProduct.id]) {
				// already have the item in the cart
				updatedOrNewCartItem = new CartItem(
					state.items[addedProduct.id].quantity + 1,
					prodPrice,
					prodTitle,
					state.items[addedProduct.id].sum + prodPrice
				)
			} else {
				updatedOrNewCartItem = new CartItem(1, prodPrice, prodTitle, prodPrice)
			}
			return {
				...state,
				items: { ...state.items, [addedProduct.id]: updatedOrNewCartItem },
				totalAmount: state.totalAmount + prodPrice,
			}
		case APPEND_TO_CART:
			const selectedCartItemAppend = state.items[action.pid]
			const updatedCartItemsAppend = new CartItem(
				selectedCartItemAppend.quantity + 1,
				selectedCartItemAppend.productPrice,
				selectedCartItemAppend.productTitle,
				selectedCartItemAppend.sum + selectedCartItemAppend.productPrice
			)

			return {
				...state,
				items: { ...state.items, [action.pid]: updatedCartItemsAppend },
				totalAmount: state.totalAmount + selectedCartItemAppend.productPrice,
			}
		case REMOVE_FROM_CART:
			const selectedCartItem = state.items[action.pid]
			const updatedCartItems = { ...state.items }
			const currentAmount = state.totalAmount
			delete updatedCartItems[action.pid]
			return {
				...state,
				items: updatedCartItems,
				totalAmount: currentAmount - selectedCartItem.sum,
			}
		case REDUCE_FROM_CART:
			const selectedCartItemReduce = state.items[action.pid]
			const currentQty = selectedCartItemReduce.quantity
			let updatedCartItemsReduce

			if (currentQty > 1) {
				const updatedCartItem = new CartItem(
					selectedCartItemReduce.quantity - 1,
					selectedCartItemReduce.productPrice,
					selectedCartItemReduce.productTitle,
					selectedCartItemReduce.sum - selectedCartItemReduce.productPrice
				)
				updatedCartItemsReduce = { ...state.items, [action.pid]: updatedCartItem }
			} else {
				updatedCartItemsReduce = { ...state.items }
				delete updatedCartItemsReduce[action.pid]
			}
			return {
				...state,
				items: updatedCartItemsReduce,
				totalAmount: state.totalAmount - selectedCartItemReduce.productPrice,
			}
		case ADD_ORDER:
			return initialState
		case DELETE_PRODUCT:
			if (!state.items[action.pid]) {
				return state
			}
			const updatedItems = { ...state.items }
			const itemTotal = state.items[action.pid].sum
			delete updatedItems[action.pid]
			return {
				...state,
				items: updatedItems,
				totalAmount: state.totalAmount - itemTotal,
			}
	}
	return state
}
