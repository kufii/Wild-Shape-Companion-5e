import React from 'react';
import PropTypes from 'prop-types';
import { View, FlatList, Text } from 'react-native';
import r from 'rnss';
import { ListItem, Divider } from 'react-native-elements';
import { titlecase, sortBy } from '../../../../api/util';
import listStyles from '../../../../styles/list';

export default class SettingsScreen extends React.Component {
	static propTypes = {
		screenProps: PropTypes.shape({
			state: PropTypes.object.isRequired,
			actions: PropTypes.object.isRequired
		}).isRequired
	};

	static navigationOptions = {
		title: 'Tip Jar'
	};

	get styles() {
		return {
			container: r`f 1; bc $contentBackgroundColor`,
			disclaimer: r`
				c $textColor
				fs $fontSizeMedium
				p 10
				flex-wrap wrap
			`,
			badge: r`bc $formButtonColor; border-color transparent`
		};
	}

	componentDidMount() {
		this.props.screenProps.actions.loadProducts();
	}

	render() {
		const { state, actions } = this.props.screenProps;
		const styles = this.styles;
		const getTitle = productId => {
			const [_, type] = productId.match(/^com\.adpyke\.druidshape\.tip\.(.+)/);
			return `${titlecase(type)} Tip`;
		};
		const extractNumber = price => {
			const [_, num] = price.match(/([\d.]+)/);
			return parseFloat(num);
		};

		return (
			<View style={styles.container}>
				<Text style={styles.disclaimer}>
					If you&lsquo;ve been enjoying Druidshape, and would like to show your support,
					please consider leaving a tip. This is obviously not mandatory and just the fact
					that you&lsquo;re using my app is extremely appreciated. Thanks! :)
				</Text>
				<FlatList
					data={state.iaps
						.filter(p => p.productId.match(/^com\.adpyke\.druidshape\.tip\./))
						.sort(sortBy(({ localizedPrice }) => extractNumber(localizedPrice)))}
					renderItem={({ item: { productId, localizedPrice } }) => (
						<ListItem
							title={getTitle(productId)}
							badge={{ value: localizedPrice, badgeStyle: styles.badge }}
							titleStyle={listStyles().itemText}
							containerStyle={listStyles().item}
							onPress={() => actions.buyProduct(productId)}
						/>
					)}
					keyExtractor={item => item.productId}
					ListHeaderComponent={() => <Divider style={listStyles().divider} />}
					ItemSeparatorComponent={() => <Divider style={listStyles().divider} />}
					ListFooterComponent={() => <Divider style={listStyles().divider} />}
				/>
			</View>
		);
	}
}
