import React, { useEffect, useState, useCallback } from 'react'
import { FlatList, Button, View, Text } from 'react-native'
import { useSelector, useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'

import ProductItem from '../../components/shop/ProductItem'
import ErrorMessage from '../../components/UI/ErrorMessage'
import SearchBar from '../../components/UI/SearchBar'
import Colors from '../../constants/Colors'
import * as cartActions from '../../store/actions/cart'
import * as productsActions from '../../store/actions/products'
/* import * as authActions from '../../store/actions/auth'
import AsyncStorage from '@react-native-community/async-storage' */

const ProductsOverviewScreen = (props) => {
	const [isRefreshing, setIsRefreshing] = useState(false)
	const [error, setError] = useState()
	const { categoryId } = props.route.params
	const products = useSelector((state) =>
		state.products.availableProducts.filter((prod) => prod.category === categoryId)
	)
	const dispatch = useDispatch()
	const viewProductHandler = (id, title) => {
		props.navigation.navigate('Detail', {
			productId: id,
			productTitle: title,
		})
	}
	const [searchValue, setSearchValue] = useState('')
	const onSearch = (text) => {
		setSearchValue(text)
	}
	const localId = useSelector((state) => state.auth.userId)
	const { t, i18n } = useTranslation()

	/* useEffect(() => {
		const tryLogin = async () => {
			const userData = await AsyncStorage.getItem('userData')
			if (!userData) {
				props.navigation.navigate('Welcome')
				return
			}
			const transformedData = JSON.parse(userData)
			const { token, userId, expiryDate } = transformedData
			const expirationDate = new Date(expiryDate)

			if (expirationDate <= new Date() || !token || !userId) {
				dispatch(authActions.logout())
				props.navigation.navigate('Welcome')
				return
			}
			const expirationTime = expirationDate.getTime() - new Date().getTime()

			dispatch(authActions.authenticate(userId, token, expirationTime))
		}

		tryLogin()
	}, [dispatch]) */

	const loadProducts = useCallback(async () => {
		setError(null)
		setIsRefreshing(true)
		try {
			await dispatch(productsActions.fetchProducts())
			setIsRefreshing(false)
		} catch (err) {
			setError(err.message)
			setIsRefreshing(false)
		}
	})

	useEffect(() => {
		const willFocusSub = props.navigation.addListener('focus', () => {
			loadProducts()
		})
		return willFocusSub
	})

	if (error) {
		return <ErrorMessage onReload={loadProducts} />
	}

	return (
		<>
			<SearchBar onSearch={onSearch} searchValue={searchValue} />
			<FlatList
				onRefresh={loadProducts}
				refreshing={isRefreshing}
				data={
					products
						? products.filter(
								(item) => item.title.toLowerCase().indexOf(searchValue.toLowerCase()) >= 0
						  )
						: null
				}
				keyExtractor={(item) => item.id}
				renderItem={({ item }) => (
					<ProductItem
						item={item}
						onSelect={() => {
							viewProductHandler(item.id, item.title)
						}}
					>
						<Button
							color={Colors.primary}
							title={t('subCat.details')}
							onPress={() => {
								viewProductHandler(item.id, item.title)
							}}
						/>
						{localId !== item.ownerId && (
							<Button
								color={Colors.primary}
								title={t('subCat.cart')}
								onPress={() => {
									dispatch(cartActions.addToCart(item))
								}}
							/>
						)}
					</ProductItem>
				)}
				ListEmptyComponent={
					!isRefreshing && (
						<View style={{ alignItems: 'center', marginTop: 20 }}>
							<Text>{t('subCat.emptyList')}</Text>
						</View>
					)
				}
			/>
		</>
	)
}

export default ProductsOverviewScreen
