import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { Error } from '../error-message/error-message';
import { selectUserRole } from '../../selectors';
import { checkAccess } from '../../Utils/check-access';
import { ERROR } from '../../constants';

export const PrivateContent = ({ children, access, serverError = null }) => {
	const userRole = useSelector(selectUserRole);
	const accessError = checkAccess(access, userRole) ? null : ERROR.ACCESS_DENIED;
	const error = serverError || accessError;

	return error ? <Error message={error} /> : children;
};

PrivateContent.propTypes = {
	access: PropTypes.arrayOf(PropTypes.number),
	children: PropTypes.node,
	serverError: PropTypes.string,
}
