import React from 'react';
import PropTypes from 'prop-types';
import { Platform, View } from 'react-native';
import r from 'rnss';
import InputScrollView from 'react-native-input-scroll-view';
import { Button } from 'react-native-elements';
import Icon from 'react-native-vector-icons/Ionicons';
import { getBottomSpace } from 'react-native-iphone-x-helper';

import IconButton from '../../../shared/icon-button';
import BeastPicker from './beast-picker';
import AlertDelete from './alert-delete';
import { icon } from '../../../../api/util';
import buttonStyles from '../../../../styles/buttons';

import { Form, getStruct, getOptions } from './form';

export default class HomebrewDetailsScreen extends React.Component {
	static propTypes = {
		navigation: PropTypes.object.isRequired,
		screenProps: PropTypes.shape({
			state: PropTypes.object.isRequired,
			actions: PropTypes.object.isRequired
		}).isRequired
	};

	static navigationOptions = ({ navigation, screenProps }) => ({
		title: navigation.getParam('edit') ? 'Edit Beast' : 'Add New Beast',
		headerRight: navigation.getParam('edit') ? (
			<IconButton
				icon={icon('trash')}
				color={r.vars().headerTextColor}
				size={r.vars().iconSizeLarge}
				onPress={() =>
					AlertDelete(navigation.getParam('edit'), screenProps.actions, () =>
						navigation.dismiss()
					)
				}
			/>
		) : null,
		headerLeft: null,
		gesturesEnabled: false
	});

	constructor(props) {
		super(props);

		const { state, actions } = props.screenProps;
		const beasts = actions.getAllBeasts().filter(b => b.name !== this.edit);

		const struct = getStruct(beasts);
		const model = (this.edit && state.homebrew.find(h => h.name === this.edit)) || {};

		this.state = { struct, model, beastPickerOpen: false };
	}

	get edit() {
		return this.props.navigation.getParam('edit');
	}

	get styles() {
		return {
			container: r`
				f 1
				fd column
				jc center
				bc $contentBackgroundColor
			`,
			form: r`f 1`,
			formContent: r`p 10`,
			bottomButton: r`h ${r.vars().bottomButtonHeight + getBottomSpace()}`,
			copyButton: r`border-color $formButtonColor`,
			copyButtonTitle: r`c $formButtonColor`,
			copyButtonContainer: r`mb 5`,
			buttonIcon: r`mr 5`
		};
	}

	submit() {
		const beast = this.form.getValue();
		if (beast) {
			const { actions } = this.props.screenProps;
			if (this.edit) {
				actions.editHomebrew(this.edit, beast);
			} else {
				actions.addHomebrew(beast);
			}
			this.props.navigation.dismiss();
		}
	}

	validate(key) {
		const component = this.form.getComponent(key);
		if (component) {
			component.validate();
		}
	}

	render() {
		const { actions } = this.props.screenProps;
		const styles = this.styles;
		const buttonTheme = buttonStyles().bottom;
		return (
			<View style={styles.container}>
				<View style={styles.form}>
					<InputScrollView
						contentContainerStyle={styles.formContent}
						keyboardOffset={
							40 + (Platform.OS === 'android' ? r.vars().bottomButtonHeight : 0)
						}
						behavior="padding"
					>
						<Button
							title="Copy Beast"
							type="outline"
							buttonStyle={styles.copyButton}
							titleStyle={styles.copyButtonTitle}
							containerStyle={styles.copyButtonContainer}
							icon={
								<Icon
									size={r.vars().iconSizeLarge}
									name={icon('copy')}
									color={r.vars().formButtonColor}
									style={styles.buttonIcon}
								/>
							}
							onPress={() => this.setState({ beastPickerOpen: true })}
						/>
						<Form
							ref={form => (this.form = form)}
							type={this.state.struct}
							options={getOptions()}
							value={this.state.model}
							onChange={(model, key) => {
								this.validate(key);
								this.setState({ model });
							}}
						/>
					</InputScrollView>
				</View>
				<View style={buttonTheme.container}>
					<Button
						title="Cancel"
						type="clear"
						containerStyle={[buttonTheme.button, buttonTheme.cancelButton]}
						buttonStyle={styles.bottomButton}
						titleStyle={buttonTheme.cancelButtonTitle}
						onPress={() => this.props.navigation.dismiss()}
					/>
					<Button
						title="Save"
						type="clear"
						containerStyle={[buttonTheme.button, buttonTheme.saveButton]}
						buttonStyle={styles.bottomButton}
						titleStyle={buttonTheme.saveButtonTitle}
						onPress={() => this.submit()}
					/>
				</View>
				<BeastPicker
					actions={actions}
					isVisible={this.state.beastPickerOpen}
					onDismiss={() => this.setState({ beastPickerOpen: false })}
					onSelect={name => this.setState({ model: actions.getBeast(name) })}
				/>
			</View>
		);
	}
}
