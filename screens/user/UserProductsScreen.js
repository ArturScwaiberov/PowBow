import React, { useState, useEffect, useCallback } from 'react'
import { FlatList, Button, Alert } from 'react-native'
import { useSelector, useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'

import ProductItem from '../../components/shop/ProductItem'
import Colors from '../../constants/Colors'
import Loading from '../../components/UI/Loading'
import * as productsActions from '../../store/actions/products'

const UserProductsScreen = (props) => {
	const [isLoading, setIsLoading] = useState(false)
	const [isRefreshing, setIsRefreshing] = useState(false)
	const [error, setError] = useState()
	const userProducts = useSelector((state) => state.products.userProducts)
	const dispatch = useDispatch()
	const { t, i18n } = useTranslation()
	const editProductHandler = (id, title) => {
		props.navigation.navigate('Edit', {
			productId: id,
			productTitle: title,
		})
	}

	const loadProducts = useCallback(async () => {
		let mounted = true
		setError(null)
		setIsRefreshing(true)
		try {
			await dispatch(productsActions.fetchProducts(t('admin.errorMessage')))
		} catch (err) {
			setError(err.message)
		}

		if (mounted) {
			setIsRefreshing(false)
		}

		return function cleanup() {
			mounted = false
		}
	}, [setIsRefreshing, setError])

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
			Alert.alert(t('admin.errorTitle'), error, [{ text: 'Ок' }])
		}
	}, [error])

	const deleteProductHandler = useCallback(
		async (item) => {
			setError(null)
			setIsLoading(true)
			try {
				await dispatch(productsActions.deleteProduct(item, t('admin.deleteError')))
			} catch (err) {
				setError(err.message)
			}
			setIsLoading(false)
		},
		[dispatch, setError, setIsLoading]
	)

	const deleteHandler = (item) => {
		Alert.alert(t('admin.deleteTitle'), t('admin.deleteQuestion'), [
			{ text: t('admin.no'), style: 'default' },
			{
				text: t('admin.yes'),
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
						title={t('admin.edit')}
						onPress={() => editProductHandler(itemData.item.id, itemData.item.title)}
					/>
					<Button
						color={Colors.primary}
						title={t('admin.delete')}
						onPress={deleteHandler.bind(this, itemData.item.id)}
					/>
				</ProductItem>
			)}
		/>
	)
}

export default UserProductsScreen
