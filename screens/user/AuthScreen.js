import React, { useCallback, useEffect, useReducer, useState } from 'react'
import {
	StyleSheet,
	ScrollView,
	View,
	KeyboardAvoidingView,
	Button,
	ActivityIndicator,
	Alert,
} from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { useDispatch } from 'react-redux'

import Card from '../../components/UI/Card'
import Input from '../../components/UI/Input'
import Colors from '../../constants/Colors'
import * as authActions from '../../store/actions/auth'

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

const AuthScreen = (props) => {
	const [isLoading, setIsLoading] = useState(false)
	const [error, setError] = useState()
	const [isSignup, setIsSignup] = useState(false)
	const dispatch = useDispatch()

	const [formState, dispatchFormState] = useReducer(formReducer, {
		inputValues: {
			email: '',
			password: '',
		},
		inputValidities: {
			email: false,
			password: false,
		},
		formIsValid: false,
	})

	useEffect(() => {
		if (error) {
			Alert.alert('Упс.. ошибка..', error, [{ text: 'Ок' }])
		}
	}, [error])

	const authHandler = async () => {
		let action
		if (isSignup) {
			action = authActions.signup(formState.inputValues.email, formState.inputValues.password)
		} else {
			action = authActions.login(formState.inputValues.email, formState.inputValues.password)
		}
		setIsLoading(true)
		try {
			await dispatch(action)
			props.navigation.navigate('ProductsNavigator')
		} catch (err) {
			setError(err.message)
			setIsLoading(false)
		}
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
		<KeyboardAvoidingView behavior='padding' keyboardVerticalOffset={50} style={styles.screen}>
			<LinearGradient colors={['#ffedff', '#ffe3ff']} style={styles.gradient}>
				<Card style={styles.authContainer}>
					<ScrollView>
						<Input
							id='email'
							label='Электронная почта'
							keyboardType='email-address'
							required
							email
							autoCapitalize='none'
							errorText='Пожалуйста введите почту'
							onInputChange={inputChangeHandler}
							initialValue=''
						/>
						<Input
							id='password'
							label='Пароль'
							keyboardType='default'
							secureTextEntry
							required
							minLength={5}
							autoCapitalize='none'
							errorText='Пожалуйста заполните поле'
							onInputChange={inputChangeHandler}
							initialValue=''
						/>
						{isSignup && (
							<Input
								id='password'
								label='Повторите пароль'
								keyboardType='default'
								secureTextEntry
								required
								minLength={5}
								autoCapitalize='none'
								errorText='Пожалуйста заполните поле'
								onInputChange={inputChangeHandler}
								initialValue=''
							/>
						)}
						<View style={styles.buttonContainer}>
							{isLoading ? (
								<ActivityIndicator size='small' color={Colors.primary} />
							) : (
								<Button
									title={isSignup ? 'Регистрация' : 'Войти'}
									color={Colors.primary}
									onPress={authHandler}
								/>
							)}
						</View>
						<View style={styles.buttonContainer}>
							<Button
								title={`Переключить на ${isSignup ? 'Вход' : 'Регистрацию'}`}
								color={Colors.accent}
								onPress={() => {
									setIsSignup((prevState) => !prevState)
								}}
							/>
						</View>
					</ScrollView>
				</Card>
			</LinearGradient>
		</KeyboardAvoidingView>
	)
}

const styles = StyleSheet.create({
	screen: { flex: 1 },
	gradient: { flex: 1, justifyContent: 'center', alignItems: 'center' },
	authContainer: { width: '80%', maxWidth: 400, maxHeight: 400, padding: 20 },
	buttonContainer: { marginTop: 15 },
})

export default AuthScreen
