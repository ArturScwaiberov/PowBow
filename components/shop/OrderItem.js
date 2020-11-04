import React, { useState } from 'react'
import { StyleSheet, View, Text, Platform } from 'react-native'
import { Ionicons } from '@expo/vector-icons'

import Colors from '../../constants/Colors'
import CartItem from './CartItem'
import Card from '../UI/Card'

const OrderItem = (props) => {
	const [showDetails, setShowDetails] = useState(false)
	return (
		<Card style={styles.orderItem}>
			{props.status === 'new' ? (
				<View style={styles.informerHolder}></View>
			) : props.status === 'completed' ? (
				<Ionicons
					name={Platform.OS === 'android' ? 'md-done-all' : 'ios-done-all'}
					size={24}
					color={Colors.primary}
					style={styles.iconHolder}
				/>
			) : (
				<Ionicons
					name={Platform.OS === 'android' ? 'md-close' : 'ios-close'}
					size={24}
					color={Colors.primary}
					style={styles.iconHolder}
				/>
			)}
			<View style={styles.summary}>
				<Text style={styles.date}>{props.date}</Text>
				<Text style={styles.totalAmount}>{props.amount}</Text>
				<Ionicons
					name={
						showDetails
							? Platform.OS === 'android'
								? 'md-eye-off'
								: 'ios-eye-off'
							: Platform.OS === 'android'
							? 'md-eye'
							: 'ios-eye'
					}
					size={24}
					color={Colors.primary}
					onPress={() => setShowDetails((prevState) => !prevState)}
				/>
			</View>
			{showDetails && (
				<View style={styles.details}>
					{props.items.map((cartItem) => (
						<CartItem
							key={cartItem.productId}
							quantity={cartItem.quantity}
							amount={cartItem.sum}
							title={cartItem.productTitle}
						/>
					))}
					<Text>
						Статус:{' '}
						{props.status === 'new'
							? 'Новый'
							: props.status === 'completed'
							? 'Выполнен'
							: 'Отменен'}
					</Text>
				</View>
			)}
			{/* <Button title='Посмотреть' color={Colors.primary} /> */}
		</Card>
	)
}

const styles = StyleSheet.create({
	orderItem: {
		marginHorizontal: 20,
		marginTop: 15,
		marginBottom: 5,
		padding: 10,
		alignItems: 'center',
	},
	informerHolder: {
		backgroundColor: Colors.accent,
		width: 16,
		height: 16,
		position: 'absolute',
		justifyContent: 'center',
		alignItems: 'center',
		borderRadius: 8,
		left: -4,
		top: -4,
	},
	iconHolder: {
		position: 'absolute',
		left: -4,
		top: -4,
	},
	summary: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		width: '100%',
		/* marginBottom: 15, */
	},
	details: {
		width: '100%',
	},
	totalAmount: {
		fontFamily: 'open-sans-bold',
		fontSize: 16,
	},
	date: {
		fontFamily: 'open-sans',
		fontSize: 16,
		color: '#888',
	},
})

export default OrderItem
