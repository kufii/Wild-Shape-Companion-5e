import React from 'react';
import r from 'rnss';
import PropTypes from 'prop-types';
import { View, Picker, Text } from 'react-native';

export default function PickerAndroid(props) {
	const options = props.options.map(({ value, text }) => (
		<Picker.Item key={value} value={value} label={text} />
	));

	return (
		<View style={[containerStyle, props.containerStyle]}>
			<Picker
				selectedValue={props.value}
				onValueChange={props.onChange}
				enabled={!props.disabled}
				mode={props.mode}
				prompt={props.prompt}
				itemStyle={props.itemStyle}
				style={props.style}
			>
				{options}
			</Picker>
		</View>
	);
}
PickerAndroid.propTypes = {
	onChange: PropTypes.func,
	value: PropTypes.string,
	options: PropTypes.arrayOf(
		PropTypes.shape({
			value: PropTypes.string.isRequired,
			text: PropTypes.string.isRequired
		})
	).isRequired,
	disabled: PropTypes.bool,
	mode: PropTypes.string,
	prompt: PropTypes.string,
	style: Text.propTypes.style,
	itemStyle: Text.propTypes.style,
	containerStyle: Text.propTypes.style
};

const containerStyle = r`br 4; bw 1; p 0; m 0`;
