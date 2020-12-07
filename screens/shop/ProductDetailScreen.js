import React from 'react'
import { StyleSheet, View, Text, ScrollView, Image, Button } from 'react-native'
import { useSelector, useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'

import NotFoundScreen from '../../screens/NotFoundScreen'
import Colors from '../../constants/Colors'
import * as cartActions from '../../store/actions/cart'

const ProductDetailScreen = ({ route, navigation }, props) => {
	const { t, i18n } = useTranslation()
	const productId = route.params?.productId ?? 'NotFound'
	const selectedProduct = useSelector((state) =>
		state.products.availableProducts.find((prod) => prod.id === productId)
	)
	const dispatch = useDispatch()
	const localId = useSelector((state) => state.auth.userId)

	if (productId === 'NotFound') {
		return <NotFoundScreen />
	}

	return (
		<ScrollView>
			<Image style={styles.image} source={{ uri: selectedProduct.imageUrl }} />
			<View style={styles.actions}>
				{localId === selectedProduct.ownerId ? (
					<Button color={Colors.primary} title={t('product.ownerMessage')} />
				) : (
					<Button
						color={Colors.primary}
						title={t('product.addToCart')}
						onPress={() => {
							dispatch(cartActions.addToCart(selectedProduct))
						}}
					/>
				)}
			</View>
			<Text style={styles.price}>{selectedProduct.price.toFixed(0)} сом</Text>
			<Text style={styles.description}>{selectedProduct.description}</Text>
		</ScrollView>
	)
}

const styles = StyleSheet.create({
	image: { width: '100%', height: 300 },
	actions: { marginVertical: 10, alignItems: 'center' },
	price: {
		fontSize: 20,
		color: '#888',
		textAlign: 'center',
		marginVertical: 20,
		fontFamily: 'open-sans-bold',
	},
	description: { fontSize: 14, textAlign: 'center', marginHorizontal: 20, fontFamily: 'open-sans' },
})

export default ProductDetailScreen
