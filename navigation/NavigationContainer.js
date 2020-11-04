import React, { useEffect } from 'react'
import { CommonActions } from '@react-navigation/native'
import { useSelector } from 'react-redux'
import ShopNavigator from './ShopNavigator'

const NavigationContainer = (props) => {
	const isAuth = useSelector((state) => !!state.auth.token)

	useEffect(() => {
		if (!isAuth) {
			CommonActions.navigate({ name: 'Auth' })
		}
	}, [isAuth])

	return <ShopNavigator />
}

export default NavigationContainer
