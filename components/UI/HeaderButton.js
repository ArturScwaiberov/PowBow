import React from 'react'
import { Platform, Text, StyleSheet, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import Colors from '../../constants/Colors'

const CustomHeaderButton = (props) => {
	return (
		<View>
			<Ionicons
				{...props}
				size={24}
				color={Platform.OS === 'android' ? 'white' : Colors.primary}
				style={{
					paddingHorizontal: 15,
					paddingVertical: 8,
				}}
			/>
			<View style={props.quantityInCart ? styles.informerHolder : styles.informerHiden}>
				<Text style={styles.cartInformer}>{props?.quantityInCart ?? ''}</Text>
			</View>
		</View>
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
		right: 8,
	},
	informerHiden: { display: 'none' },
	cartInformer: {
		fontSize: 12,
		fontFamily: 'open-sans-bold',
		color: Colors.primary,
	},
})

export default CustomHeaderButton
