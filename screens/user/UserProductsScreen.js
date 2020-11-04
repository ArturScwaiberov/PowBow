import React, { useState, useEffect, useCallback } from 'react'
import { FlatList, Button, Alert } from 'react-native'
import { useSelector, useDispatch } from 'react-redux'

import ProductItem from '../../components/shop/ProductItem'
import Colors from '../../constants/Colors'
import * as productsActions from '../../store/actions/products'
import Loading from '../../components/UI/Loading'

const UserProductsScreen = (props) => {
	const [isLoading, setIsLoading] = useState(false)
	const [isRefreshing, setIsRefreshing] = useState(false)
	const [error, setError] = useState()
	const userProducts = useSelector((state) => state.products.userProducts)
	const dispatch = useDispatch()
	const editProductHandler = (id, title) => {
		props.navigation.navigate('Edit', {
			productId: id,
			productTitle: title,
		})
	}

	const loadProducts = useCallback(async () => {
		setError(null)
		setIsRefreshing(true)
		try {
			await dispatch(productsActions.fetchProducts())
		} catch (err) {
			setError(err.message)
		}
		setIsRefreshing(false)
	}, [dispatch, setIsRefreshing, setError])

	useEffect(() => {
		const willFocusSub = props.navigation.addListener('focus', () => {
			loadProducts()
		})

		return willFocusSub
	}, [loadProducts])

	useEffect(() => {
		setIsLoading(true)
		loadProducts().then(setIsLoading(false))
	}, [dispatch])

	useEffect(() => {
		if (error) {
			Alert.alert('Упс.. ошибка', error, [{ text: 'Ок' }])
		}
	}, [error])

	const deleteProductHandler = useCallback(
		async (item) => {
			setError(null)
			setIsLoading(true)
			try {
				await dispatch(productsActions.deleteProduct(item))
			} catch (err) {
				setError(err.message)
			}
			setIsLoading(false)
		},
		[dispatch, setError, setIsLoading]
	)

	const deleteHandler = (item) => {
		Alert.alert('Удалить товар?', 'Вы хотите удалить товар?', [
			{ text: 'Нет', style: 'default' },
			{
				text: 'Да',
				style: 'destructive',
				onPress: () => {
					deleteProductHandler(item)
				},
			},
		])
	}

	if (error) {
		return <ErrorMessage onReload={loadProducts} />
	}

	if (isLoading) {
		return <Loading />
	}

	return (
		<FlatList
			onRefresh={loadProducts}
			refreshing={isRefreshing}
			data={userProducts}
			keyExtractor={(item) => item.id}
			renderItem={(itemData) => (
				<ProductItem
					item={itemData.item}
					onSelect={() => editProductHandler(itemData.item.id, itemData.item.title)}
				>
					<Button
						color={Colors.primary}
						title='Редактировать'
						onPress={() => editProductHandler(itemData.item.id, itemData.item.title)}
					/>
					<Button
						color={Colors.primary}
						title='Удалить'
						onPress={deleteHandler.bind(this, itemData.item.id)}
					/>
				</ProductItem>
			)}
		/>
	)
}

export default UserProductsScreen
