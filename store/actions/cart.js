export const ADD_TO_CART = 'ADD_TO_CART'
export const APPEND_TO_CART = 'APPEND_TO_CART'
export const REMOVE_FROM_CART = 'REMOVE_FROM_CART'
export const REDUCE_FROM_CART = 'REDUCE_FROM_CART'

export const addToCart = (product) => {
	return { type: ADD_TO_CART, product: product }
}

export const appendToCart = (productId) => {
	return { type: APPEND_TO_CART, pid: productId }
}

export const removeFromCart = (productId) => {
	return { type: REMOVE_FROM_CART, pid: productId }
}

export const reduceFromCart = (productId) => {
	return { type: REDUCE_FROM_CART, pid: productId }
}
