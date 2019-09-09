import React from 'react';
import PropTypes from 'prop-types';
import { Platform, View } from 'react-native';
import r from 'rnss';
import Modal from 'react-native-modal';
import { Input, Button } from 'react-native-elements';
import buttonStyles from '../../styles/buttons';

export default function ModalTextbox({
	actions,
	isVisible,
	isRequired,
	text = '',
	onDismiss,
	onSubmit,
	onChangeText
}) {
	const theme = actions.getCurrentTheme();
	const buttonTheme = buttonStyles.bottom(theme);
	const styles = {
		modal: r`h auto`,
		container: r`bc ${theme.contentBackgroundColor}`,
		textbox: r`c ${theme.textColor}`,
		textboxContainer: r`mb 5`
	};

	return (
		<Modal isVisible={isVisible} style={styles.modal}>
			<View style={styles.container}>
				<Input
					autoFocus
					selectTextOnFocus={Platform.OS === 'android'}
					value={text}
					onChangeText={onChangeText}
					inputStyle={styles.textbox}
					containerStyle={styles.textboxContainer}
				/>
				<View style={buttonTheme.container}>
					<Button
						title="Cancel"
						type="clear"
						containerStyle={[buttonTheme.button, buttonTheme.cancelButton]}
						titleStyle={buttonTheme.cancelButtonTitle}
						onPress={() => onDismiss && onDismiss()}
					/>
					<Button
						title="OK"
						type="clear"
						containerStyle={[buttonTheme.button, buttonTheme.saveButton]}
						titleStyle={buttonTheme.saveButtonTitle}
						onPress={() => {
							if (!text.trim() && isRequired) return;
							onSubmit && onSubmit(text);
							onDismiss && onDismiss();
						}}
					/>
				</View>
			</View>
		</Modal>
	);
}
ModalTextbox.propTypes = {
	actions: PropTypes.object.isRequired,
	isVisible: PropTypes.bool,
	isRequired: PropTypes.bool,
	text: PropTypes.string,
	onDismiss: PropTypes.func,
	onSubmit: PropTypes.func,
	onChangeText: PropTypes.func
};
