import React, { useCallback, useEffect, useReducer, useState } from 'react'
import {
	StyleSheet,
	View,
	Text,
	Button,
	FlatList,
	Alert,
	TouchableOpacity,
	Platform,
	TouchableNativeFeedback,
} from 'react-native'
import { useSelector, useDispatch } from 'react-redux'
import { FontAwesome } from '@expo/vector-icons'
import { useTranslation } from 'react-i18next'

import Colors from '../../constants/Colors'
import CartItem from '../../components/shop/CartItem'
import Card from '../../components/UI/Card'
import Loading from '../../components/UI/Loading'
import Input from '../../components/UI/Input'
import * as cartActions from '../../store/actions/cart'
import * as ordersActions from '../../store/actions/orders'
import * as userRealtimeActions from '../../store/actions/users'

const FORM_INPUT_UPDATE = 'FORM_INPUT_UPDATE'

const formReducer = (state, action) => {
	if (action.type === FORM_INPUT_UPDATE) {
		const updatedValues = {
			...state.inputValues,
			[action.input]: action.value,
		}
		const updatedValidities = {
			...state.inputValidities,
			[action.input]: action.isValid,
		}
		let updatedFormIsValid = true
		for (const key in updatedValidities) {
			updatedFormIsValid = updatedFormIsValid && updatedValidities[key]
		}

		return {
			formIsValid: updatedFormIsValid,
			inputValidities: updatedValidities,
			inputValues: updatedValues,
		}
	}
	return state
}

const CartScreen = (props) => {
	const [error, setError] = useState()
	const [isLoading, setIsLoading] = useState(false)
	const [payMeth, setPayMeth] = useState('наличные')
	const cartTotalAmount = useSelector((state) => state.cart.totalAmount)
	const localUserData = useSelector((state) => state.auth.userSelfData)
	const adress = localUserData[0]?.adress ?? ''
	const catId = localUserData[0]?.catId ?? ''
	const phone = localUserData[0]?.phone ?? ''

	const amountOfItems = Object.keys(useSelector((state) => state.cart.items)).length
	const dispatch = useDispatch()
	const { t, i18n } = useTranslation()
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
	const itemsInTable = useSelector((state) => {
		const transformedCartItems = []
		for (const key in state.cart.items) {
			transformedCartItems.push(
				`Товар: ${state.cart.items[key].productTitle}, кол-во: ${state.cart.items[key].quantity}, цена: ${state.cart.items[key].productPrice}, сумма: ${state.cart.items[key].sum}`
			)
		}
		return transformedCartItems
	})

	const [formState, dispatchFormState] = useReducer(formReducer, {
		inputValues: {
			phone: phone ? phone : '',
			adress: adress ? adress : '',
		},
		inputValidities: {
			phone: phone ? true : false,
			adress: adress ? true : false,
		},
		formIsValid: false,
	})

	let TouchableCmp = TouchableOpacity

	if (Platform.OS === 'android' && Platform.Version >= 21) {
		TouchableCmp = TouchableNativeFeedback
	}

	useEffect(() => {
		if (error) {
			Alert.alert(t('cart.errorTitle'), error, [{ text: 'Ок' }])
		}
	}, [error])

	const makeOrderHandler = async () => {
		setError(null)
		setIsLoading(true)
		try {
			await dispatch(
				userRealtimeActions.updateUser(
					catId,
					formState.inputValues.phone,
					formState.inputValues.adress,
					t('auth.errorMessageUpdateUser')
				)
			)
			await dispatch(
				ordersActions.addOrder(
					cartItems,
					cartTotalAmount,
					formState.inputValues.phone,
					formState.inputValues.adress,
					payMeth,
					t('auth.errorMessageConfirmOrder')
				)
			)
			await dispatch(
				ordersActions.toMailOrder(
					itemsInTable,
					cartTotalAmount,
					formState.inputValues.phone,
					formState.inputValues.adress,
					payMeth,
					t('order.errorMessageSendMail')
				)
			)
			Alert.alert(t('cart.successOrderTitle'), t('cart.successOrderMessage'), [
				{ text: 'Ок', onPress: () => props.navigation.navigate('Categories') },
			])
		} catch (err) {
			setError(err.message)
		}
		setIsLoading(false)
	}

	const inputChangeHandler = useCallback(
		(inputIdentifier, inputValue, inputValidity) => {
			dispatchFormState({
				type: FORM_INPUT_UPDATE,
				value: inputValue,
				isValid: inputValidity,
				input: inputIdentifier,
			})
		},
		[dispatchFormState]
	)

	return (
		<View style={styles.container}>
			<FlatList
				data={cartItems}
				keyExtractor={(item) => item.productId}
				contentContainerStyle={{ flexGrow: 1, paddingBottom: 10 }}
				ListHeaderComponent={() => {
					return (
						<View style={styles.screen}>
							{isLoading ? (
								<Loading style={{ marginVertical: 20 }} />
							) : (
								<Card style={styles.cart}>
									<Input
										id='phone'
										label={t('cart.phone')}
										errorText={t('cart.phoneError')}
										keyboardType='number-pad'
										onInputChange={inputChangeHandler}
										required
										minLength={9}
										initialValue={formState.inputValues.phone}
										clearButtonMode='always'
									/>
									<Input
										id='adress'
										label={t('cart.adress')}
										errorText={t('cart.adressError')}
										keyboardType='default'
										onInputChange={inputChangeHandler}
										required
										initialValue={formState.inputValues.adress}
										clearButtonMode='always'
									/>
									<View>
										<Text style={styles.payText}>{t('cart.payMethod')}</Text>
										<View style={styles.payHolder}>
											<TouchableCmp onPress={() => setPayMeth('наличные')}>
												<View
													style={payMeth === 'наличные' ? styles.payOptionActive : styles.payOption}
												>
													<FontAwesome
														name={payMeth === 'наличные' ? 'dot-circle-o' : 'circle-o'}
														size={24}
														color={payMeth === 'наличные' ? Colors.primary : '#ccc'}
													/>
													<Text style={styles.payName}>{t('cart.payCash')}</Text>
												</View>
											</TouchableCmp>
											<TouchableCmp onPress={() => setPayMeth('карта')}>
												<View
													style={payMeth === 'карта' ? styles.payOptionActive : styles.payOption}
												>
													<FontAwesome
														name={payMeth === 'карта' ? 'dot-circle-o' : 'circle-o'}
														size={24}
														color={payMeth === 'карта' ? Colors.primary : '#ccc'}
													/>
													<Text style={styles.payName}>{t('cart.payCard')}</Text>
												</View>
											</TouchableCmp>
										</View>
									</View>
									<View style={styles.summary}>
										<Text style={styles.summaryText}>
											{t('cart.total')}:{' '}
											<Text style={styles.amount}>{Math.round(cartTotalAmount * 100) / 100}</Text>
										</Text>
										<Button
											color={Colors.primary}
											title={t('cart.makeOrder')}
											disabled={
												cartItems.length === 0 ||
												formState.inputValues.phone === '' ||
												formState.inputValues.adress === ''
											}
											onPress={makeOrderHandler}
										/>
									</View>
								</Card>
							)}
						</View>
					)
				}}
				renderItem={(itemData) => (
					<CartItem
						title={itemData.item.productTitle}
						quantity={itemData.item.quantity}
						price={itemData.item.productPrice}
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
					<Text style={{ textAlign: 'center' }}>{t('cart.emptyList')}</Text>
				)}
			/>
		</View>
	)
}

const styles = StyleSheet.create({
	container: { flex: 1 },
	screen: { paddingHorizontal: 20, paddingTop: 15 },
	cart: {
		marginBottom: 10,
		padding: 10,
	},
	summary: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		marginTop: 1,
		borderTopWidth: 1,
		borderTopColor: '#ccc',
	},
	payText: { fontFamily: 'open-sans-bold', marginVertical: 8 },
	payHolder: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 8 },
	payOption: {
		padding: 8,
		borderBottomColor: '#ccc',
		borderBottomWidth: 1,
		opacity: 0.5,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	payOptionActive: {
		padding: 8,
		borderBottomColor: Colors.primary,
		borderBottomWidth: 1,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	payName: { marginLeft: 8 },
	summaryText: { fontFamily: 'open-sans-bold', fontSize: 18 },
	amount: { color: Colors.primary },
})

export default CartScreen
