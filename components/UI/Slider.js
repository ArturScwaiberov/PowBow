import React from 'react'
import { FlatListSlider } from 'react-native-flatlist-slider'

const Slider = (props) => {
	const images = [
		{
			banner: require('../../data/images/FreeDelivery.jpg'),
			catId: 'c1',
			catTitle: 'Test title',
			enableLink: true,
		},
		{
			banner: require('../../data/images/SuperPocket.jpg'),
			catId: '',
			catTitle: '',
			enableLink: false,
		},
		{
			banner: require('../../data/images/FreeDelivery.jpg'),
			catId: 'c2',
			catTitle: 'Chicken wonderful',
			enableLink: true,
		},
	]

	return (
		<FlatListSlider
			data={images}
			onPress={(item) =>
				images[item].enableLink
					? props.navigation.navigate('Home', {
							categoryId: images[item].catId,
							categoryTitle: images[item].catTitle,
					  })
					: {}
			}
			imageKey={'banner'}
			local
			indicator={false}
			height={100}
			animation={false}
		/>
	)
}

export default Slider
