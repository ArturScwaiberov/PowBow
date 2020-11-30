import React, { useCallback, useEffect, useState } from 'react'
import { StyleSheet, View, Text, FlatList } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'

import * as ordersActions from '../../store/actions/orders'
import OrderItem from '../../components/shop/OrderItem'
import Loading from '../../components/UI/Loading'
import ErrorMessage from '../../components/UI/ErrorMessage'

const OrdersScreen = (props) => {
	const [isLoading, setIsLoading] = useState(false)
	const [error, setError] = useState()
	const orders = useSelector((state) => state.orders.orders).sort(function (a, b) {
		return new Date(b.date) - new Date(a.date)
	})
	const dispatch = useDispatch()

	const loadOrders = useCallback(async () => {
		let mounted = true
		setError()
		setIsLoading(true)
		try {
			await dispatch(ordersActions.fetchOrders())
		} catch (err) {
			setError(err.message)
		}

		if (mounted) {
			setIsLoading(false)
		}

		return function cleanup() {
			mounted = false
		}
	}, [dispatch, setError, setIsLoading, isLoading, error])

	useEffect(() => {
		loadOrders()
	}, [])

	if (error) {
		return <ErrorMessage onReload={loadOrders} />
	}

	if (isLoading) {
		return <Loading />
	}

	return (
		<View>
			<FlatList
				data={orders}
				keyExtractor={(item) => item.id}
				renderItem={(itemData) => (
					<OrderItem
						amount={itemData.item.totalAmount}
						date={itemData.item.readableDate}
						items={itemData.item.items}
						status={itemData.item.status}
					/>
				)}
				ListEmptyComponent={
					!isLoading && (
						<Text style={{ textAlign: 'center', marginTop: 20 }}>
							Ваш список заказов пока пуст.. 📄
						</Text>
					)
				}
			/>
		</View>
	)
}

const styles = StyleSheet.create({
	screen: { flex: 1, justifyContent: 'center', alignItems: 'center' },
})

export default OrdersScreen
