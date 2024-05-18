import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import styles from './error-message.module.css';
export const Error = ({ message }) => {
	return (
		message && (
			<>
				<div className={styles.error_container}>
					<div className={styles.error}>
						<h2>Error 404!</h2>
						<div>{message}</div>
						<Link to="/">
							<div>Return to Main Page</div>
						</Link>
					</div>
				</div>
			</>
		)
	);
};

Error.propTypes = {
	message: PropTypes.string,
}
