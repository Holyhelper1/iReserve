import PropTypes from 'prop-types';
import styles from './success-message.module.css';

export const SuccessMessage = ({ children }) => {
	return <div className={styles.success_message}>{children}</div>;
};

SuccessMessage.propTypes = {
	children: PropTypes.node,
}
