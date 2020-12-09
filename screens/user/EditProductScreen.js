import React, { useEffect, useCallback, useReducer, useState } from 'react'
import {
	StyleSheet,
	View,
	ScrollView,
	Alert,
	Button,
	KeyboardAvoidingView,
	Text,
} from 'react-native'
import { useSelector, useDispatch } from 'react-redux'
import { Picker } from '@react-native-community/picker'
import { useTranslation } from 'react-i18next'
import { YellowBox } from 'react-native'

import * as productsActions from '../../store/actions/products'
import Colors from '../../constants/Colors'
import Input from '../../components/UI/Input'
import Loading from '../../components/UI/Loading'

YellowBox.ignoreWarnings(['Non-serializable values were found in the navigation state'])

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
			...state,
			inputValues: updatedValues,
			inputValidities: updatedValidities,
			formIsValid: updatedFormIsValid,
		}
	}
	return state
}

const EditProductScreen = (props) => {
	const [isLoading, setIsLoading] = useState(false)
	const [error, setError] = useState()
	const prodId = props.route.params?.productId ?? ''
	const editedProduct = useSelector((state) =>
		state.products.userProducts.find((prod) => prod.id === prodId)
	)
	const dispatch = useDispatch()
	const { t, i18n } = useTranslation()

	const [formState, dispatchFormState] = useReducer(formReducer, {
		inputValues: {
			title: editedProduct ? editedProduct.title : '',
			imageUrl: editedProduct ? editedProduct.imageUrl : '',
			description: editedProduct ? editedProduct.description : '',
			price: editedProduct ? editedProduct.price : '',
		},
		inputValidities: {
			title: editedProduct ? true : false,
			imageUrl: editedProduct ? true : false,
			description: editedProduct ? true : false,
			price: editedProduct ? true : false,
		},
		formIsValid: editedProduct ? true : false,
	})

	const productCategories = useSelector((state) => state.categories.availableCategories)

	const [cat, setCat] = useState(editedProduct ? editedProduct.category : productCategories[0].id)

	useEffect(() => {
		if (error) {
			Alert.alert(t('editProduct.errorTitle'), error, [{ text: 'Ок' }])
		}
	}, [error])

	const submitHandler = useCallback(async () => {
		if (!formState.formIsValid) {
			Alert.alert(t('editProduct.errorTitle'), 'Пожалуйста заполните все поля', [{ text: 'Ок' }])
			return
		}
		setError(null)
		setIsLoading(true)

		try {
			if (editedProduct) {
				await dispatch(
					productsActions.updateProduct(
						prodId,
						formState.inputValues.title,
						formState.inputValues.imageUrl,
						+formState.inputValues.price,
						formState.inputValues.description,
						cat
					)
				)
			} else {
				await dispatch(
					productsActions.createProduct(
						formState.inputValues.title,
						formState.inputValues.imageUrl,
						+formState.inputValues.price,
						formState.inputValues.description,
						cat
					)
				)
			}
			props.navigation.goBack()
		} catch (err) {
			setError(err.message)
		}

		setIsLoading(false)
	}, [dispatch, prodId, formState, cat])

	useEffect(() => {
		props.navigation.setParams({ submit: submitHandler })
	}, [submitHandler])

	const inputChangeHandler = useCallback(
		(inputIdenty, inputValue, inputValidity) => {
			dispatchFormState({
				type: FORM_INPUT_UPDATE,
				value: inputValue,
				isValid: inputValidity,
				input: inputIdenty,
			})
		},
		[dispatchFormState]
	)

	if (isLoading) {
		return <Loading />
	}

	return (
		<KeyboardAvoidingView style={{ flex: 1 }} behavior='padding' keyboardVerticalOffset={80}>
			<ScrollView>
				<View style={styles.form}>
					<Input
						id='title'
						label={t('editProduct.label')}
						errorText={t('editProduct.errorInput')}
						keyboardType='default'
						onInputChange={inputChangeHandler}
						initialValue={editedProduct ? editedProduct.title : ''}
						initiallyValid={!!editedProduct}
						required
					/>
					<Input
						id='imageUrl'
						label={t('editProduct.image')}
						errorText={t('editProduct.errorInput')}
						keyboardType='email-address'
						onInputChange={inputChangeHandler}
						initialValue={editedProduct ? editedProduct.imageUrl : ''}
						initiallyValid={!!editedProduct}
						required
					/>
					<Input
						id='price'
						label={t('editProduct.price')}
						errorText={t('editProduct.errorPrice')}
						keyboardType='number-pad'
						onInputChange={inputChangeHandler}
						initialValue={editedProduct ? editedProduct.price.toString() : ''}
						initiallyValid={!!editedProduct}
						required
						min={0}
						max={1000000}
					/>
					<Input
						id='description'
						label={t('editProduct.description')}
						errorText={t('editProduct.errorDesc')}
						multiline
						keyboardType='default'
						onInputChange={inputChangeHandler}
						initialValue={editedProduct ? editedProduct.description : ''}
						initiallyValid={!!editedProduct}
						required
						minLength={5}
					/>
					<Text style={styles.label}>{t('editProduct.category')}</Text>
					<Picker selectedValue={cat} onValueChange={(itemValue) => setCat(itemValue)}>
						{Object.keys(productCategories).map((key) => {
							return (
								<Picker.Item
									label={productCategories[key].title}
									value={productCategories[key].id}
									key={key}
								/>
							)
						})}
					</Picker>
					<Button title={t('editProduct.done')} color={Colors.primary} onPress={submitHandler} />
					<Button
						title={t('editProduct.cancel')}
						color={Colors.accent}
						onPress={() => {
							props.navigation.goBack() /* navigate('Admin') */
						}}
					/>
				</View>
			</ScrollView>
		</KeyboardAvoidingView>
	)
}

const styles = StyleSheet.create({
	form: { margin: 20 },
	label: { fontFamily: 'open-sans-bold', marginVertical: 8 },
})

export default EditProductScreen
