import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, ScrollView } from 'react-native';
import { ListItem } from 'react-native-elements';
import listStyles from '../../../styles/list';

export default class SettingsScreen extends React.Component {
	static propTypes = {
		screenProps: PropTypes.object
	};

	static navigationOptions = {
		title: 'Settings'
	};

	get styles() {
		const { actions } = this.props.screenProps;
		const theme = actions.getCurrentTheme();

		return StyleSheet.create({
			container: {
				flex: 1,
				backgroundColor: theme.contentBackgroundColorDark
			}
		});
	}

	render() {
		const { state, actions } = this.props.screenProps;
		const theme = actions.getCurrentTheme();
		const styles = this.styles;
		const listTheme = listStyles(theme);

		return (
			<ScrollView ref={list => this.list = list} contentContainerStyle={styles.container}>
				<ListItem
					title='Dark Mode'
					containerStyle={listTheme.item}
					titleStyle={listTheme.itemText}
					switch={{
						value: state.darkMode,
						onValueChange: value => actions.setDarkMode(value)
					}}
				/>
			</ScrollView>
		);
	}
}
