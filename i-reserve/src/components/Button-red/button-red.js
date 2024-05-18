import PropTypes from 'prop-types';
import styles from './button-red.module.css';

export const ButtonRed = ({ children, onClick, disabled }) => {
	return (
		<button
			className={styles.all_cancel_button}
			onClick={onClick}
			disabled={disabled}
		>
			{children}
		</button>
	);
};

ButtonRed.propTypes = {
	children: PropTypes.node,
	onClick: PropTypes.func,
	disabled: PropTypes.bool,
};
