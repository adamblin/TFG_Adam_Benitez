import { StyleSheet } from 'react-native';
import { type ColorPalette } from '../../../shared/theme';

export const makeStyles = (colors: ColorPalette) => StyleSheet.create({
	message: {
		marginTop: 16,
		paddingVertical: 10,
		paddingHorizontal: 12,
		borderRadius: 6,
	},
	messageSuccess: {
		backgroundColor: colors.success + '20',
		color: colors.success,
	},
	messageError: {
		backgroundColor: colors.error + '20',
		color: colors.error,
	},
});
