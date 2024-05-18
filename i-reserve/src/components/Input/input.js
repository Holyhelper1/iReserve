import PropTypes from 'prop-types';
import { forwardRef } from 'react';
import styles from './input.module.css';

export const Input = forwardRef(({ ...props }, ref) => {
	return <input className={styles.all_inputs} {...props} ref={ref} />;
});

Input.propTypes = {
	type: PropTypes.string,
	placeholder: PropTypes.string,
};
