import React from 'react';
import {TouchableOpacity, Image, StyleSheet,  TouchableNativeFeedback, Platform} from 'react-native';

let TouchableCmp = TouchableOpacity

	if (Platform.OS === 'android' && Platform.Version >= 21) {
		TouchableCmp = TouchableNativeFeedback
	}

export default (ChildItem = ({
  item,
  style,
  onPress,
  index,
  imageKey,
  local,
  height
}) => {
  return (
    <TouchableCmp
      style={styles.container}
      onPress={() => onPress(index)}>
      <Image
        style={[styles.image, style, {height: height}]}
        source={local ? item[imageKey] : {uri: item[imageKey]}}
      />
    </TouchableCmp>
  );
});

const styles = StyleSheet.create({
  container: {},
  image: {
    height: 230,
    resizeMode: 'contain',
  },
});
