import React, { useCallback, useEffect, useState } from 'react'
import { FlatList, TouchableOpacity, Platform, TouchableNativeFeedback } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'

import CategoryItem from '../../components/shop/CategoryItem'
import ErrorMessage from '../../components/UI/ErrorMessage'
import Slider from '../../components/UI/Slider'
import * as categoriesActions from '../../store/actions/categories'
import * as userRealtimeActions from '../../store/actions/users'

const CategoriesOverviewScreen = (props) => {
	const [isRefreshing, setIsRefreshing] = useState(false)
	const [error, setError] = useState()
	const categories = useSelector((state) => state.categories.availableCategories)
	const dispatch = useDispatch()
	const viewCategoryHandler = (id, title) => {
		props.navigation.navigate('Home', {
			categoryId: id,
			categoryTitle: title,
		})
	}

	let TouchableCmp = TouchableOpacity

	if (Platform.OS === 'android' && Platform.Version >= 21) {
		TouchableCmp = TouchableNativeFeedback
	}

	const loadCategories = useCallback(async () => {
		setError(null)
		setIsRefreshing(true)

		try {
			await dispatch(categoriesActions.fetchCategories())
			await dispatch(userRealtimeActions.fetchUserData())
		} catch (err) {
			setError(err)
		}

		setIsRefreshing(false)
	}, [dispatch, setIsRefreshing, isRefreshing, setError, error])

	useEffect(() => {
		const willFocusSub = props.navigation.addListener('focus', () => {
			loadCategories()
		})

		return willFocusSub
	}, [])

	if (error) {
		console.log(error)
		return <ErrorMessage onReload={loadCategories} />
	}

	return (
		<>
			<FlatList
				onRefresh={loadCategories}
				refreshing={isRefreshing}
				columnWrapperStyle={{ paddingHorizontal: 2 }}
				data={categories}
				horizontal={false}
				numColumns={2}
				keyExtractor={(item) => item.id}
				renderItem={(itemData) => (
					<CategoryItem
						item={itemData.item}
						onSelect={() => {
							viewCategoryHandler(itemData.item.id, itemData.item.title)
						}}
					/>
				)}
				ListHeaderComponent={<Slider navigation={props.navigation} />}
			/>
		</>
	)
}

export default CategoriesOverviewScreen
