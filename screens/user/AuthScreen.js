import React, { useCallback, useEffect, useReducer, useState } from 'react'
import {
	StyleSheet,
	ScrollView,
	View,
	KeyboardAvoidingView,
	Button,
	ActivityIndicator,
	Alert,
	Platform,
} from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'

import Card from '../../components/UI/Card'
import Input from '../../components/UI/Input'
import Colors from '../../constants/Colors'
import * as authActions from '../../store/actions/auth'
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

const AuthScreen = (props) => {
	const [isLoading, setIsLoading] = useState(false)
	const [error, setError] = useState()
	const [isSignup, setIsSignup] = useState(false)
	const [isForgot, setIsForgot] = useState(false)
	const { t, i18n } = useTranslation()
	const dispatch = useDispatch()

	const [formState, dispatchFormState] = useReducer(formReducer, {
		inputValues: {
			email: '',
			password: '',
			passwordConfirm: '',
		},
		inputValidities: {
			email: false,
			password: false,
			passwordConfirm: false,
		},
		formIsValid: false,
	})

	useEffect(() => {
		if (error) {
			Alert.alert(t('auth.errorTitle'), error, [
				{
					text: 'Ок',
				},
			])
		}
	}, [error])

	const authHandler = async () => {
		let action
		let actionRealtime
		if (isSignup) {
			action = authActions.signup(
				formState.inputValues.email,
				formState.inputValues.password,
				formState.inputValues.passwordConfirm,
				t('auth.errorMessageRegister'),
				t('auth.errorMessageExist'),
				t('auth.errorMessageConfirmaPass')
			)
			actionRealtime = userRealtimeActions.createUser(
				formState.inputValues.email,
				t('auth.errorMessageCreateUser')
			)
		} else {
			action = authActions.login(
				formState.inputValues.email,
				formState.inputValues.password,
				t('auth.errorMessageEnter'),
				t('auth.errorMessageWrongPass'),
				t('auth.errorMessageNoSuchEmail')
			)
		}
		setIsLoading(true)
		try {
			await dispatch(action)
			if (isSignup) {
				await dispatch(actionRealtime)
			}
			await dispatch(userRealtimeActions.fetchUserData(t('categories.errorMessageFetchUser')))
			props.navigation.navigate('ProductsNavigator')
		} catch (err) {
			setError(err.message)
			setIsLoading(false)
			setError(null)
		}
	}

	const forgotHandler = async () => {
		setIsLoading(true)
		try {
			await dispatch(
				authActions.resetEmail(
					formState.inputValues.email,
					t('auth.errorMessageReset'),
					t('auth.errorMessageNotFound')
				)
			)
			setIsSignup(false)
			setIsForgot(false)
			setIsLoading(false)
		} catch (err) {
			setError(err.message)
			setIsLoading(false)
			setError(null)
		}
	}

	const forgotSwitcher = () => {
		setIsForgot(true)
	}

	const registerAuthSwitcher = () => {
		setIsForgot(false)
		setIsSignup((prevState) => !prevState)
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
		<KeyboardAvoidingView
			behavior={Platform.OS === 'ios' ? 'padding' : ''}
			keyboardVerticalOffset={Platform.OS === 'ios' ? 50 : null}
			style={styles.screen}
		>
			<LinearGradient colors={['#ffedff', '#ffe3ff']} style={styles.gradient}>
				<Card style={styles.authContainer}>
					<ScrollView>
						<Input
							id='email'
							label={t('auth.email')}
							errorText={t('auth.emailErr')}
							keyboardType='email-address'
							required
							email
							autoCapitalize='none'
							onInputChange={inputChangeHandler}
							initialValue=''
						/>
						{!isForgot && (
							<Input
								id='password'
								label={t('auth.password')}
								errorText={t('auth.passwordErr')}
								keyboardType='default'
								secureTextEntry
								required
								minLength={5}
								autoCapitalize='none'
								onInputChange={inputChangeHandler}
								initialValue=''
							/>
						)}
						{isSignup && !isForgot && (
							<Input
								id='passwordConfirm'
								label={t('auth.passwordConf')}
								errorText={t('auth.passwordErr')}
								keyboardType='default'
								secureTextEntry
								required
								minLength={5}
								autoCapitalize='none'
								onInputChange={inputChangeHandler}
								initialValue=''
								initiallyValid={false}
							/>
						)}
						<View style={styles.buttonHolder}>
							{isLoading ? (
								<ActivityIndicator size='small' color={Colors.primary} />
							) : isForgot ? (
								<View style={styles.button}>
									<Button
										title={t('auth.restore')}
										color={Colors.primary}
										onPress={forgotHandler}
										disabled={!formState.inputValidities.email}
									/>
								</View>
							) : (
								<View style={styles.button}>
									<Button
										title={isSignup ? t('auth.register') : t('auth.enter')}
										color={Colors.primary}
										onPress={authHandler}
										disabled={
											isSignup
												? !formState.formIsValid
												: !(formState.inputValidities.email && formState.inputValidities.password)
										}
									/>
								</View>
							)}
							<View style={styles.button}>
								<Button
									title={`${isSignup ? t('auth.haveAcc') : t('auth.haveNoAcc')}`}
									color={Colors.accent}
									onPress={registerAuthSwitcher}
								/>
							</View>
							<View style={styles.button}>
								<Button title={t('auth.forgotPass')} color='#999' onPress={forgotSwitcher} />
							</View>
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
	authContainer: { width: '85%', maxWidth: 400, maxHeight: 400, padding: 20 },
	buttonHolder: { marginTop: 8 },
	button: { marginTop: 8 },
})

export default AuthScreen
