import PropTypes from 'prop-types';
import styles from './h2.module.css';

export const H2 = ({ children }) => {
	return <h2 className={styles.h2}>{children}</h2>;
};

H2.propTypes = {
	children: PropTypes.node,
}
