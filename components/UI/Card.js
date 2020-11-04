import React from 'react'
import { StyleSheet, View } from 'react-native'

const Card = (props) => {
	return <View style={{ ...props.style, ...styles.cart }}>{props.children}</View>
}

const styles = StyleSheet.create({
	cart: {
		shadowColor: 'black',
		shadowOpacity: 0.05,
		shadowOffset: { width: 0, height: 2 },
		shadowRadius: 2,
		elevation: 3,
		borderRadius: 10,
		backgroundColor: 'white',
	},
})

export default Card
