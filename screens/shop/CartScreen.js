import React, { useEffect, useState } from 'react'
import { StyleSheet, View, Text, Button, FlatList, Alert } from 'react-native'
import { useSelector, useDispatch } from 'react-redux'

import Colors from '../../constants/Colors'
import CartItem from '../../components/shop/CartItem'
import Card from '../../components/UI/Card'
import * as cartActions from '../../store/actions/cart'
import * as ordersActions from '../../store/actions/orders'
import Loading from '../../components/UI/Loading'

const CartScreen = (props) => {
	const [error, setError] = useState()
	const [isLoading, setIsLoading] = useState(false)
	const cartTotalAmount = useSelector((state) => state.cart.totalAmount)
	const amountOfItems = Object.keys(useSelector((state) => state.cart.items)).length
	const cartItems = useSelector((state) => {
		const transformedCartItems = []
		for (const key in state.cart.items) {
			transformedCartItems.push({
				productId: key,
				productTitle: state.cart.items[key].productTitle,
				productPrice: state.cart.items[key].productPrice,
				quantity: state.cart.items[key].quantity,
				sum: state.cart.items[key].sum,
			})
		}
		return transformedCartItems.sort((a, b) => (a.productId > b.productId ? 1 : -1))
	})
	const dispatch = useDispatch()

	useEffect(() => {
		if (error) {
			Alert.alert('Упс.. ошибка', error, [{ text: 'Ок' }])
		}
	}, [error])

	const makeOrderHandler = async () => {
		setError(null)
		setIsLoading(true)
		try {
			await dispatch(ordersActions.addOrder(cartItems, cartTotalAmount))
		} catch (err) {
			setError(err.message)
		}
		setIsLoading(false)
	}

	return (
		<View style={styles.screen}>
			{isLoading ? (
				<Loading style={{ marginVertical: 20 }} />
			) : (
				<Card style={styles.summary}>
					<Text style={styles.summaryText}>
						Итого: <Text style={styles.amount}>{Math.round(cartTotalAmount * 100) / 100}</Text>
					</Text>
					<Button
						color={Colors.primary}
						title='Оформить заказ'
						disabled={cartItems.length === 0}
						onPress={makeOrderHandler}
					/>
				</Card>
			)}
			<FlatList
				data={cartItems}
				keyExtractor={(item) => item.productId}
				renderItem={(itemData) => (
					<CartItem
						title={itemData.item.productTitle}
						quantity={itemData.item.quantity}
						amount={itemData.item.sum}
						deletable
						onRemove={() => {
							dispatch(cartActions.removeFromCart(itemData.item.productId))
						}}
						onReduce={() => {
							dispatch(cartActions.reduceFromCart(itemData.item.productId))
						}}
						onAppend={() => {
							dispatch(cartActions.appendToCart(itemData.item.productId))
						}}
					/>
				)}
				ListEmptyComponent={() => (
					<Text style={{ textAlign: 'center' }}>Ваша корзина пуста.. 🛒</Text>
				)}
			/>
		</View>
	)
}

const styles = StyleSheet.create({
	screen: { marginHorizontal: 20, marginVertical: 15 },
	summary: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		marginBottom: 20,
		padding: 10,
	},
	summaryText: { fontFamily: 'open-sans-bold', fontSize: 18 },
	amount: { color: Colors.primary },
})

export default CartScreen
