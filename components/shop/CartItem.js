import React from 'react'
import { StyleSheet, View, Text, Platform, TouchableOpacity } from 'react-native'
import { Ionicons } from '@expo/vector-icons'

const CartItem = (props) => {
	const IconCmp = () => {
		if (props.quantity > 1) {
			return (
				<TouchableOpacity onPress={props.onReduce} style={styles.iconHolder}>
					<Ionicons name={'ios-remove-circle'} size={24} color={'red'} />
				</TouchableOpacity>
			)
		} else {
			return (
				<TouchableOpacity onPress={props.onRemove} style={styles.iconTrashHolder}>
					<Ionicons
						name={Platform.OS === 'android' ? 'md-trash' : 'ios-trash'}
						size={24}
						color={'red'}
					/>
				</TouchableOpacity>
			)
		}
	}

	return (
		<View style={styles.cartItem}>
			<View>
				<Text style={styles.mainText}>{props.title}</Text>
				<Text style={styles.quantity}>
					{props.quantity} x {props.price} = <Text style={styles.mainText}>{props.amount}</Text>
				</Text>
			</View>
			<View>
				{props.deletable && (
					<View style={styles.itemData}>
						<TouchableOpacity onPress={props.onAppend} style={styles.iconHolder}>
							<Ionicons name={'ios-add-circle'} size={24} color={'green'} />
						</TouchableOpacity>
						<IconCmp />
					</View>
				)}
			</View>
		</View>
	)
}

const styles = StyleSheet.create({
	cartItem: {
		marginVertical: 4,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingLeft: 16,
		paddingRight: 6,
	},
	itemDataText: { flexDirection: 'row', width: '70%', alignItems: 'center' },
	itemData: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		flex: 1,
	},
	iconHolder: { marginHorizontal: 10 },
	iconTrashHolder: { marginLeft: 13, marginRight: 12 },
	quantity: { fontFamily: 'open-sans', color: '#888', fontSize: 16 },
	mainText: { fontFamily: 'open-sans-bold', fontSize: 16 },
})

export default CartItem
