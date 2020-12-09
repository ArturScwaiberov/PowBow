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
import { useTranslation, withTranslation } from 'react-i18next'

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
import CategoriesOverviewScreen from '../screens/shop/CategoriesOverviewScreen'
import SearchScreen from '../screens/shop/SearchScreen'
import AboutCompanyScreen from '../screens/shop/AboutCompanyScreen'
import FeedbackScreen from '../screens/shop/FeedbackScreen'
import ChangeModal from '../components/UI/ChangeModal'

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

const navOptions = {
	headerStyle: {
		backgroundColor: Platform.OS === 'android' ? Colors.primary : 'white',
	},
	headerTitleStyle: {
		fontFamily: 'open-sans-bold',
	},
	headerBackTitleStyle: {
		fontFamily: 'open-sans',
	},
}

const ProductsNavigator = withTranslation()(({ t, i18n }) => {
	const productsCount = Object.keys(useSelector((state) => state.cart.items)).length
	const isSignedIn = useSelector((state) => state.auth.isAuth)

	return (
		<Stack.Navigator
			screenOptions={({ navigation }) => ({
				...navOptions,
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
						title: i18n.t('categories.title'),
						headerTitleAlign: 'center',
						headerTintColor: Platform.OS === 'android' ? 'white' : Colors.primary,
						headerLeft: ({}) => (
							<View style={{ flexDirection: 'row' }}>
								<HeaderLeft navigation={navigation} />
								<ChangeModal navigation={navigation} />
							</View>
						),
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
						title:
							route.params.lang === 'ru'
								? route.params.categoryTitle
								: route.params.categoryTitleKg,
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
						title: i18n.t('cart.title'),
						headerTintColor: Platform.OS === 'android' ? 'white' : Colors.primary,
						headerRightContainerStyle: { display: 'none' },
					})}
				/>
				<Stack.Screen
					name='Search'
					component={SearchScreen}
					options={({ route }) => ({
						title: i18n.t('searchAll.title'),
						headerTintColor: Platform.OS === 'android' ? 'white' : Colors.primary,
						/* headerRightContainerStyle: { display: 'none' }, */
					})}
				/>
			</>
		</Stack.Navigator>
	)
})

const OrdersNavigator = withTranslation()(({ t, i18n }) => {
	return (
		<Stack.Navigator
			screenOptions={({ navigation }) => ({
				...navOptions,
				headerLeft: ({}) => <HeaderLeft navigation={navigation} />,
			})}
		>
			<Stack.Screen
				name='Order'
				component={OrdersScreen}
				options={({ route }) => ({
					title: i18n.t('order.title'),
					headerTintColor: Platform.OS === 'android' ? 'white' : Colors.primary,
				})}
			/>
		</Stack.Navigator>
	)
})

const AboutNavigator = withTranslation()(({ t, i18n }) => {
	return (
		<Stack.Navigator
			screenOptions={({ navigation }) => ({
				...navOptions,
				headerLeft: () => <HeaderLeft navigation={navigation} />,
			})}
		>
			<Stack.Screen
				name='About'
				component={AboutCompanyScreen}
				options={({ route }) => ({
					title: i18n.t('about.title'),
					headerTintColor: Platform.OS === 'android' ? 'white' : Colors.primary,
				})}
			/>
		</Stack.Navigator>
	)
})

const AuthNavigator = withTranslation()(({ t, i18n }) => {
	return (
		<Stack.Navigator
			screenOptions={({ navigation }) => ({
				...navOptions,
				headerLeft: () => <HeaderLeft navigation={navigation} />,
			})}
		>
			<Stack.Screen
				name='Auth'
				component={AuthScreen}
				options={() => ({
					title: i18n.t('auth.title'),
					headerTintColor: Platform.OS === 'android' ? 'white' : Colors.primary,
					/* headerShown: false, */
				})}
			/>
		</Stack.Navigator>
	)
})

const FeedbackNavigator = withTranslation()(({ t, i18n }) => {
	return (
		<Stack.Navigator
			screenOptions={({ navigation }) => ({
				...navOptions,
				headerLeft: () => <HeaderLeft navigation={navigation} />,
			})}
		>
			<Stack.Screen
				name='Feedback'
				component={FeedbackScreen}
				options={() => ({
					title: i18n.t('feedback.title'),
					headerTintColor: Platform.OS === 'android' ? 'white' : Colors.primary,
				})}
			/>
		</Stack.Navigator>
	)
})

const AdminNavigator = withTranslation()(({ t, i18n }) => {
	const isSignedIn = useSelector((state) => state.auth.isAuth)

	return (
		<Stack.Navigator
			screenOptions={({ navigation }) => ({
				...navOptions,
				headerLeft: ({}) => <HeaderLeft navigation={navigation} />,
			})}
		>
			{isSignedIn && (
				<>
					<Stack.Screen
						name='Admin'
						component={UserProductsScreen}
						options={({ route, navigation }) => ({
							title: i18n.t('admin.title'),
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
								title: route.params?.productTitle ?? i18n.t('editProduct.title'),
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
			)}
		</Stack.Navigator>
	)
})

function CustomDrawerContent(props) {
	const { t, i18n } = useTranslation()
	const isSignedIn = useSelector((state) => state.auth.isAuth)
	const getRole = useSelector((state) => state.auth.userSelfData)
	const isAdmin = getRole[0]?.role ?? ''
	const userEmail = getRole[0]?.email ?? ''
	const dispatch = useDispatch()

	return (
		<DrawerContentScrollView {...props}>
			<SafeAreaView>
				{isSignedIn && (
					<View style={{ backgroundColor: '#d5d5d5' }}>
						<DrawerItem
							label={userEmail}
							icon={({ focused, color }) => (
								<Ionicons
									name={
										isAdmin === 'admin'
											? Platform.OS === 'android'
												? 'md-happy'
												: 'ios-happy'
											: Platform.OS === 'android'
											? 'md-contact'
											: 'ios-contact'
									}
									size={26}
									color={color}
								/>
							)}
						/>
					</View>
				)}
				<DrawerItemList {...props} />
				{isSignedIn && (
					<DrawerItem
						label={t('auth.titleDrawerLogout')}
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

const DrawerComponent = withTranslation()(({ t, i18n }) => {
	const dimensions = useWindowDimensions()
	const ordersCount = useSelector((state) => state.orders.orders)
	const completedOrdersCount = ordersCount.filter((order) => order.status === 'new').length
	const productsCount = useSelector((state) => state.products.userProducts).length
	const isSignedIn = useSelector((state) => state.auth.isAuth)
	const getRole = useSelector((state) => state.auth.userSelfData)
	const isAdmin = getRole[0]?.role ?? ''

	return (
		<Drawer.Navigator
			/* drawerType={dimensions.width >= 768 ? 'permanent' : 'slide'} */
			drawerContent={(props) => <CustomDrawerContent {...props} />}
			drawerContentOptions={{
				activeTintColor: Platform.OS === 'android' ? Colors.primary : 'white',
				activeBackgroundColor: Platform.OS === 'android' ? '#f5f5f5' : Colors.primary,
				labelStyle: { fontFamily: 'open-sans' },
			}}
		>
			{!isSignedIn && (
				<Drawer.Screen
					name='Welcome'
					component={StartupScreen}
					options={({ navigation }) => ({
						title: i18n.t('welcome.titleDrawer'),
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
					title: i18n.t('categories.titleDrawer'),
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
							title: i18n.t('order.titleDrawer'),
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
					{isAdmin === 'admin' && (
						<Drawer.Screen
							name='AdminNavigator'
							component={AdminNavigator}
							options={() => ({
								title: i18n.t('admin.titleDrawer'),
								drawerIcon: ({ focused, color }) => (
									<View>
										<Ionicons
											name={Platform.OS === 'android' ? 'md-create' : 'ios-create'}
											size={24}
											color={color}
										/>

										<View style={productsCount > 0 ? styles.informerHolder : styles.informerHiden}>
											<Text style={styles.cartInformer}>{productsCount}</Text>
										</View>
									</View>
								),
							})}
						/>
					)}
					<Drawer.Screen
						name='FeedbackNavigator'
						component={FeedbackNavigator}
						options={() => ({
							title: i18n.t('feedback.titleDrawer'),
							drawerIcon: ({ focused, color }) => (
								<Ionicons
									name={Platform.OS === 'android' ? 'md-flame' : 'ios-flame'}
									size={24}
									color={color}
								/>
							),
						})}
					/>
				</>
			)}
			<Drawer.Screen
				name='AboutNavigator'
				component={AboutNavigator}
				options={() => ({
					title: i18n.t('about.titleDrawer'),
					drawerIcon: ({ focused, color }) => (
						<Ionicons
							name={Platform.OS === 'android' ? 'md-ribbon' : 'ios-ribbon'}
							size={24}
							color={color}
						/>
					),
				})}
			/>
			{!isSignedIn && (
				<Drawer.Screen
					name='AdminNavigator'
					component={AuthNavigator}
					options={() => ({
						title: i18n.t('auth.titleDrawerLogin'),
						drawerIcon: ({ focused, color }) => (
							<Ionicons
								name={Platform.OS === 'android' ? 'md-log-in' : 'ios-log-in'}
								size={24}
								color={color}
							/>
						),
					})}
				/>
			)}
		</Drawer.Navigator>
	)
})

function App({ t, i18n }) {
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
