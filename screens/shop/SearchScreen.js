import React, { useCallback, useEffect, useState } from 'react'
import {
	StyleSheet,
	View,
	Text,
	FlatList,
	Image,
	TouchableOpacity,
	TouchableNativeFeedback,
	Platform,
} from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { Ionicons } from '@expo/vector-icons'

import ErrorMessage from '../../components/UI/ErrorMessage'
import SearchBar from '../../components/UI/SearchBar'
import Colors from '../../constants/Colors'
import * as productsActions from '../../store/actions/products'
import * as cartActions from '../../store/actions/cart'

const SearchScreen = (props) => {
	const [isRefreshing, setIsRefreshing] = useState(false)
	const [error, setError] = useState()
	const products = useSelector((state) => state.products.availableProducts)
	const [searchValue, setSearchValue] = useState('')
	const dispatch = useDispatch()
	const onSearch = (text) => {
		setSearchValue(text)
	}
	const viewProductHandler = (id, title) => {
		props.navigation.navigate('Detail', {
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
	}, [])

	if (error) {
		return <ErrorMessage onReload={loadProducts} />
	}

	let TouchableCmp = TouchableOpacity

	if (Platform.OS === 'android' && Platform.Version >= 21) {
		TouchableCmp = TouchableNativeFeedback
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
						: products
				}
				renderItem={({ item }) => (
					<TouchableCmp
						style={styles.contentHolder}
						onPress={() => viewProductHandler(item.id, item.title)}
					>
						<>
							<View style={styles.imageContainer}>
								<Image style={styles.image} source={{ uri: item.imageUrl }} />
							</View>
							<View style={styles.textHolder}>
								<Text style={styles.title}>{item.title}</Text>
								<Text style={styles.description}>{item.description}</Text>
							</View>
							<View style={styles.priceHolder}>
								<Text style={styles.price}>{item.price} с</Text>
							</View>
							<View style={styles.cartHolder}>
								<TouchableCmp
									onPress={() => {
										dispatch(cartActions.addToCart(item))
									}}
								>
									<Ionicons
										name={Platform.OS === 'android' ? 'md-cart' : 'ios-cart'}
										size={24}
										color={Colors.primary}
									/>
								</TouchableCmp>
							</View>
						</>
					</TouchableCmp>
				)}
				ListEmptyComponent={
					!isRefreshing && (
						<View style={{ alignItems: 'center', marginTop: 20 }}>
							<Text>Упс... ничего не найдено 🙊</Text>
						</View>
					)
				}
			/>
		</>
	)
}

const styles = StyleSheet.create({
	contentHolder: {
		flexDirection: 'row',
		marginHorizontal: 20,
		marginTop: 10,
		flex: 1,
		backgroundColor: '#f9f9f9',
		borderRadius: 10,
		overflow: 'hidden',
	},
	imageContainer: {
		borderRadius: 10,
		overflow: 'hidden',
	},
	image: { width: 118, height: 118 },
	textHolder: {
		flexDirection: 'column',
		marginLeft: 10,
		flex: 1,
	},
	title: { fontFamily: 'open-sans-bold', fontSize: 16, marginTop: 5 },
	description: { fontFamily: 'open-sans', fontSize: 14, marginTop: 5 },
	priceHolder: {
		position: 'absolute',
		left: 2,
		bottom: 2,
		paddingVertical: 3,
		paddingHorizontal: 6,
		backgroundColor: '#f1f1f1',
		borderRadius: 20,
		borderColor: '#ccc',
		borderWidth: 2,
	},
	price: {
		color: Colors.primary,
		fontFamily: 'open-sans-bold',
		fontSize: 18,
	},
	cartHolder: {
		position: 'absolute',
		bottom: 2,
		right: 2,
		paddingVertical: 2,
		paddingHorizontal: 10,
		backgroundColor: '#f1f1f1',
		borderRadius: 20,
		borderColor: '#ccc',
		borderWidth: 2,
	},
})

export default SearchScreen
