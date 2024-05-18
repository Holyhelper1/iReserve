import PropTypes from 'prop-types';
import styles from './button.module.css';

export const Button = ({ children, onClick, disabled }) => {
	return (
		<button className={styles.all_button} onClick={onClick} disabled={disabled}>
			{children}
		</button>
	);
};

Button.propTypes = {
	children: PropTypes.node,
	onClick: PropTypes.func,
	disabled: PropTypes.bool,
};
