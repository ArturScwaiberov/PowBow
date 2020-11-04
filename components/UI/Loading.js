import React from 'react'
import { StyleSheet, View, ActivityIndicator } from 'react-native'
import Colors from '../../constants/Colors'

const Loading = (props) => {
	return (
		<View style={{ ...styles.screen, ...props.style }}>
			<ActivityIndicator size='large' color={Colors.primary} />
		</View>
	)
}

const styles = StyleSheet.create({
	screen: { flex: 1, justifyContent: 'center', alignItems: 'center' },
})

export default Loading
