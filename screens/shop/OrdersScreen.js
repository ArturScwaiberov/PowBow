import React, { useCallback, useEffect, useState } from 'react'
import { View, Text, FlatList } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'

import * as ordersActions from '../../store/actions/orders'
import OrderItem from '../../components/shop/OrderItem'
import Loading from '../../components/UI/Loading'
import ErrorMessage from '../../components/UI/ErrorMessage'

const OrdersScreen = (props) => {
	const [isLoading, setIsLoading] = useState(false)
	const [error, setError] = useState()
	const [t, i18n] = useTranslation()
	const orders = useSelector((state) => state.orders.orders).sort(function (a, b) {
		return new Date(b.date) - new Date(a.date)
	})
	const dispatch = useDispatch()

	const loadOrders = useCallback(async () => {
		let mounted = true
		setError(null)
		setIsLoading(true)
		try {
			await dispatch(ordersActions.fetchOrders(t('order.errorMessageFethcOrders')))

			if (mounted) setIsLoading(false)
		} catch (err) {
			setError(err.message)
			setIsLoading(false)
		}

		return function cleanup() {
			mounted = false
		}
	}, [])

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
						<Text style={{ textAlign: 'center', marginTop: 20 }}>{t('order.emptyList')}</Text>
					)
				}
			/>
		</View>
	)
}

export default OrdersScreen
