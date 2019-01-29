/* eslint-disable react/prop-types */
/* eslint-disable react/display-name */
import React from 'react';
import { createBottomTabNavigator, createStackNavigator } from 'react-navigation';
import Icon from 'react-native-vector-icons/Ionicons';
import Beasts from './beasts';
import Favorites from './favorites';
import Settings from './settings';

const Tabs = createBottomTabNavigator({
	Beasts: {
		screen: Beasts,
		tabBarIcon: ({ tintColor }) => <Icon name='ios-star' size={17} color={tintColor} />
	},
	Favorites: {
		screen: Favorites,
		tabBarIcon: ({ tintColor }) => <Icon name='ios-star' size={17} color={tintColor} />
	},
	Settings: {
		screen: Settings,
		tabBarIcon: ({ tintColor }) => <Icon name='ios-star' size={17} color={tintColor} />
	}
}, {
	tabBarOptions: {
		showIcon: true
	}
});
export default createStackNavigator({ Tabs }, { headerMode: 'none' });
