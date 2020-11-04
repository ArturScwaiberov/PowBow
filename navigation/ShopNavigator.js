import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import {
	createDrawerNavigator,
	DrawerContentScrollView,
	DrawerItem,
	DrawerItemList,
} from '@react-navigation/drawer'
import { createStackNavigator } from '@react-navigation/stack'
import { Platform, useWindowDimensions, View, Text, StyleSheet, SafeAreaView } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useDispatch, useSelector } from 'react-redux'

import Colors from '../constants/Colors'
import CustomHeaderButton from '../components/UI/HeaderButton'
import ProductsOverviewScreen from '../screens/shop/ProductsOverviewScreen'
import ProductDetailScreen from '../screens/shop/ProductDetailScreen'
import CartScreen from '../screens/shop/CartScreen'
import OrdersScreen from '../screens/shop/OrdersScreen'
import UserProductsScreen from '../screens/user/UserProductsScreen'
import EditProductScreen from '../screens/user/EditProductScreen'
import AuthScreen from '../screens/user/AuthScreen'
import StartupScreen from '../screens/StartupScreen'
import * as authActions from '../store/actions/auth'
import NotFoundScreen from '../screens/NotFoundScreen'
import CategoriesOverviewScreen from '../screens/shop/CategoriesOverviewScreen'
import SearchScreen from '../screens/shop/SearchScreen'

const Stack = createStackNavigator()
const Drawer = createDrawerNavigator()

const HeaderLeft = ({ navigation }) => {
	return (
		<CustomHeaderButton
			name={Platform.OS === 'android' ? 'md-menu' : 'ios-menu'}
			onPress={() => {
				navigation.toggleDrawer()
			}}
		/>
	)
}

const navOptions = () => ({
	headerStyle: {
		backgroundColor: Platform.OS === 'android' ? Colors.primary : '',
	},
	headerTitleStyle: {
		fontFamily: 'open-sans-bold',
	},
	headerBackTitleStyle: {
		fontFamily: 'open-sans',
	},
})

function ProductsNavigator() {
	const productsCount = Object.keys(useSelector((state) => state.cart.items)).length
	const isSignedIn = useSelector((state) => state.auth.isAuth)

	return (
		<Stack.Navigator
			screenOptions={({ navigation }) => ({
				navOptions,
				headerTruncatedBackTitle: '',
				headerRight: () => {
					return (
						<CustomHeaderButton
							name={Platform.OS === 'android' ? 'md-cart' : 'ios-cart'}
							quantityInCart={productsCount}
							onPress={() => {
								navigation.navigate(isSignedIn ? 'Cart' : 'AdminNavigator')
							}}
						/>
					)
				},
			})}
		>
			<>
				<Stack.Screen
					name='Categories'
					component={CategoriesOverviewScreen}
					options={({ navigation }) => ({
						title: 'Категории',
						headerTintColor: Platform.OS === 'android' ? 'white' : Colors.primary,
						headerLeft: ({}) => <HeaderLeft navigation={navigation} />,
						headerRight: () => {
							return (
								<View style={{ flexDirection: 'row' }}>
									<CustomHeaderButton
										name={Platform.OS === 'android' ? 'md-search' : 'ios-search'}
										onPress={() => {
											navigation.navigate('Search')
										}}
									/>
									<CustomHeaderButton
										name={Platform.OS === 'android' ? 'md-cart' : 'ios-cart'}
										quantityInCart={productsCount}
										onPress={() => {
											navigation.navigate(isSignedIn ? 'Cart' : 'AdminNavigator')
										}}
									/>
								</View>
							)
						},
					})}
				/>
				<Stack.Screen
					name='Home'
					component={ProductsOverviewScreen}
					options={({ navigation, route }) => ({
						title: route.params.categoryTitle,
						headerTintColor: Platform.OS === 'android' ? 'white' : Colors.primary,
						headerRight: () => {
							return (
								<View style={{ flexDirection: 'row' }}>
									<CustomHeaderButton
										name={Platform.OS === 'android' ? 'md-cart' : 'ios-cart'}
										quantityInCart={productsCount}
										onPress={() => {
											navigation.navigate(isSignedIn ? 'Cart' : 'AdminNavigator')
										}}
									/>
								</View>
							)
						},
					})}
				/>
				<Stack.Screen
					name='Detail'
					component={ProductDetailScreen}
					options={({ route }) => ({
						title: route.params.productTitle,
						headerTintColor: Platform.OS === 'android' ? 'white' : Colors.primary,
					})}
				/>
				<Stack.Screen
					name='Cart'
					component={CartScreen}
					options={({ route }) => ({
						title: 'Ваша корзина',
						headerTintColor: Platform.OS === 'android' ? 'white' : Colors.primary,
						headerRightContainerStyle: { display: 'none' },
					})}
				/>
				<Stack.Screen
					name='Search'
					component={SearchScreen}
					options={({ route }) => ({
						title: 'Поиск по всем категориям',
						headerTintColor: Platform.OS === 'android' ? 'white' : Colors.primary,
						/* headerRightContainerStyle: { display: 'none' }, */
					})}
				/>
			</>
		</Stack.Navigator>
	)
}

function OrdersNavigator() {
	return (
		<Stack.Navigator
			screenOptions={({ navigation }) => ({
				navOptions,
				headerLeft: ({}) => <HeaderLeft navigation={navigation} />,
			})}
		>
			<Stack.Screen
				name='Order'
				component={OrdersScreen}
				options={({ route }) => ({
					title: 'Ваши заказы',
					headerTintColor: Platform.OS === 'android' ? 'white' : Colors.primary,
				})}
			/>
		</Stack.Navigator>
	)
}

function AdminNavigator() {
	const isSignedIn = useSelector((state) => state.auth.isAuth)

	return (
		<Stack.Navigator
			screenOptions={({ navigation }) => ({
				navOptions,
				headerLeft: ({}) => <HeaderLeft navigation={navigation} />,
			})}
		>
			{isSignedIn ? (
				<>
					<Stack.Screen
						name='Admin'
						component={UserProductsScreen}
						options={({ route, navigation }) => ({
							title: 'Ваши продукты',
							headerTintColor: Platform.OS === 'android' ? 'white' : Colors.primary,
							headerRight: () => {
								return (
									<CustomHeaderButton
										name={Platform.OS === 'android' ? 'md-add' : 'ios-add'}
										onPress={() => {
											navigation.navigate('Edit')
										}}
									/>
								)
							},
						})}
					/>
					<Stack.Screen
						name='Edit'
						component={EditProductScreen}
						options={({ route }) => {
							const submit = route.params?.submit
							return {
								title: route.params?.productTitle ?? 'Создать новый',
								headerTintColor: Platform.OS === 'android' ? 'white' : Colors.primary,
								headerRight: () => {
									return (
										<CustomHeaderButton
											name={Platform.OS === 'android' ? 'md-done-all' : 'ios-done-all'}
											onPress={() => {
												submit()
											}}
										/>
									)
								},
							}
						}}
					/>
				</>
			) : (
				<>
					<Stack.Screen
						name='Auth'
						component={AuthScreen}
						options={() => ({
							title: 'Авторизация',
							headerTintColor: Platform.OS === 'android' ? 'white' : Colors.primary,
							/* headerShown: false, */
						})}
					/>
				</>
			)}
		</Stack.Navigator>
	)
}

function CustomDrawerContent(props) {
	const isSignedIn = useSelector((state) => state.auth.isAuth)
	const dispatch = useDispatch()

	return (
		<DrawerContentScrollView {...props}>
			<SafeAreaView>
				<DrawerItemList {...props} />
				{isSignedIn && (
					<DrawerItem
						label='Выход'
						onPress={() => {
							dispatch(authActions.logout())
							props.navigation.navigate('ProductsNavigator')
						}}
						icon={({ focused, color }) => (
							<Ionicons
								name={Platform.OS === 'android' ? 'md-log-out' : 'ios-log-out'}
								size={26}
								color={color}
							/>
						)}
					/>
				)}
			</SafeAreaView>
		</DrawerContentScrollView>
	)
}

function DrawerComponent() {
	const dimensions = useWindowDimensions()
	const ordersCount = useSelector((state) => state.orders.orders)
	const completedOrdersCount = ordersCount.filter((order) => order.status === 'new').length
	const productsCount = useSelector((state) => state.products.userProducts).length
	const isSignedIn = useSelector((state) => state.auth.isAuth)

	return (
		<Drawer.Navigator
			drawerType={dimensions.width >= 768 ? 'permanent' : 'slide'}
			drawerContent={(props) => <CustomDrawerContent {...props} />}
			drawerContentOptions={{
				activeTintColor: Platform.OS === 'android' ? Colors.primary : 'white',
				activeBackgroundColor: Platform.OS === 'android' ? 'white' : Colors.primary,
				labelStyle: { fontFamily: 'open-sans' },
			}}
		>
			{!isSignedIn && (
				<Drawer.Screen
					name='Welcome'
					component={StartupScreen}
					options={({ navigation }) => ({
						title: 'Доброе пожаловать',
						drawerIcon: ({ focused, color }) => (
							<Ionicons
								name={Platform.OS === 'android' ? 'md-star' : 'ios-star'}
								size={24}
								color={color}
							/>
						),
						headerTintColor: Platform.OS === 'android' ? 'white' : Colors.primary,
					})}
				/>
			)}
			<Drawer.Screen
				name='ProductsNavigator'
				component={ProductsNavigator}
				options={() => ({
					title: 'Категории',
					drawerIcon: ({ focused, color }) => (
						<Ionicons
							name={Platform.OS === 'android' ? 'md-list' : 'ios-list'}
							size={26}
							color={color}
						/>
					),
				})}
			/>
			{isSignedIn && (
				<>
					<Drawer.Screen
						name='OrdersNavigator'
						component={OrdersNavigator}
						options={() => ({
							title: 'История заказов',
							drawerIcon: ({ focused, color }) => (
								<View>
									<Ionicons
										name={Platform.OS === 'android' ? 'md-paper' : 'ios-paper'}
										size={24}
										color={color}
									/>

									<View
										style={completedOrdersCount > 0 ? styles.informerHolder : styles.informerHiden}
									>
										<Text style={styles.cartInformer}>{completedOrdersCount}</Text>
									</View>
								</View>
							),
						})}
					/>
				</>
			)}
			<Drawer.Screen
				name='AdminNavigator'
				component={AdminNavigator}
				options={() => ({
					title: isSignedIn ? 'Ваши продукты' : 'Войти',
					drawerIcon: ({ focused, color }) => (
						<View>
							<Ionicons
								name={
									isSignedIn
										? Platform.OS === 'android'
											? 'md-create'
											: 'ios-create'
										: Platform.OS === 'android'
										? 'md-log-in'
										: 'ios-log-in'
								}
								size={24}
								color={color}
							/>

							{isSignedIn && (
								<View style={productsCount > 0 ? styles.informerHolder : styles.informerHiden}>
									<Text style={styles.cartInformer}>{productsCount}</Text>
								</View>
							)}
						</View>
					),
				})}
			/>
		</Drawer.Navigator>
	)
}

function App() {
	return (
		<NavigationContainer>
			<DrawerComponent />
		</NavigationContainer>
	)
}

const styles = StyleSheet.create({
	informerHolder: {
		backgroundColor: Colors.accent,
		width: 16,
		height: 16,
		position: 'absolute',
		justifyContent: 'center',
		alignItems: 'center',
		borderRadius: 8,
		right: -8,
		top: -8,
	},
	informerHiden: { display: 'none' },
	cartInformer: {
		fontSize: 12,
		fontFamily: 'open-sans-bold',
		color: Colors.primary,
	},
})

export default App
