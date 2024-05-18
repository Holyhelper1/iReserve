import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { CLOSE_MODAL, openModal, removeHotelAsync } from '../../../../actions';
import { useNavigate } from 'react-router-dom';
import { checkAccess } from '../../../../Utils/check-access';
import { ROLE } from '../../../../constants';
import { selectUserRole } from '../../../../selectors';
import { ButtonRed } from '../../../../components';
import adminLogo from '../../../../image/adminLogo.png';
import styles from './special-panel.module.css';

export const SpecialPanel = ({ id, createdAt, editButton }) => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const userRole = useSelector(selectUserRole);

	const onHotelRemove = (id) => {
		dispatch(
			openModal({
				text: 'Are you sure that you want to delete this Hotel?',
				onConfirm: () => {
					dispatch(removeHotelAsync(id)).then(() => {
						navigate('/');
					});
					dispatch(CLOSE_MODAL);
				},
				onCancel: () => dispatch(CLOSE_MODAL),
			}),
		);
	};

	const isAdmin = checkAccess([ROLE.ADMIN], userRole);

	return (
		<div className={styles.special_panel}>
			{isAdmin && (
				<div className={styles.editButtons}>
					<img className={styles.adminLogo} src={adminLogo} alt="adminLogo" />
					{editButton}
					{createdAt && (
						<ButtonRed onClick={() => onHotelRemove(id)}>
							Delete Hotel
						</ButtonRed>
					)}
				</div>
			)}
		</div>
	);
};

SpecialPanel.propTypes = {
	id: PropTypes.string,
	createdAt: PropTypes.string,
	editButton: PropTypes.node,
};
