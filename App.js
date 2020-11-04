import { StatusBar } from 'expo-status-bar'
import React, { useState } from 'react'
import { createStore, combineReducers, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import { AppLoading } from 'expo'
import * as Font from 'expo-font'
import ReduxThunk from 'redux-thunk'

/* import NavigationContainer from './navigation/NavigationContainer' */
import ShopNavigator from './navigation/ShopNavigator'
import categoryReducer from './store/reducers/categories'
import productReducer from './store/reducers/products'
import cartReducer from './store/reducers/cart'
import authReducer from './store/reducers/auth'
import ordersReducer from './store/reducers/orders'

const rootReducer = combineReducers({
	auth: authReducer,
	categories: categoryReducer,
	products: productReducer,
	cart: cartReducer,
	orders: ordersReducer,
})

const store = createStore(rootReducer, applyMiddleware(ReduxThunk))

const fetchFonts = () => {
	return Font.loadAsync({
		'open-sans': require('./assets/fonts/OpenSans-Regular.ttf'),
		'open-sans-bold': require('./assets/fonts/OpenSans-Bold.ttf'),
	})
}

export default function App() {
	const [fontLoaded, setFontLoaded] = useState(false)

	if (!fontLoaded) {
		return (
			<AppLoading
				startAsync={fetchFonts}
				onFinish={() => {
					setFontLoaded(true)
				}}
			/>
		)
	}

	return (
		<Provider store={store}>
			<StatusBar barStyle='light-content' style='auto' backgroundColor='#ffa3c7' />
			{/* <NavigationContainer /> */}
			<ShopNavigator />
		</Provider>
	)
}
