import React, { useState } from 'react';
import styles from './control-panel.module.css';
import userLogo from '../../../../image/user-logo.png';
import { ModalAuth } from '../../../modal-auth/modal-auth';
import { Link } from 'react-router-dom';
import { Button } from '../../../Button/button';
import { useDispatch, useSelector } from 'react-redux';
import { selectUserData, selectUserLogin, selectUserRole } from '../../../../selectors';
import { checkAccess } from '../../../../Utils/check-access';
import { ROLE } from '../../../../constants';
import { logout } from '../../../../actions';
import adminLogo from '../../../../image/adminLogo.png';

export const HeaderControlPanel = () => {
	const [isModalOpen, setIsModalOpen] = useState(false);

	const dispatch = useDispatch();
	const roleId = useSelector(selectUserRole);
	const login = useSelector(selectUserLogin);
	const user = useSelector(selectUserData);

	const handleAuthConfirm = () => {
		setIsModalOpen(true);
	};

	const handleAuthCancel = () => {
		setIsModalOpen(false);
	};

	const onLogout = () => {
		dispatch(logout());
		sessionStorage.removeItem('userData');
	};

	const isAdmin = checkAccess([ROLE.ADMIN], roleId);

	return (
		<div className={styles.control_panel_container}>
			{roleId === ROLE.GUEST ? (
				<div className={styles.login_panel_button_container}>
					<Button onClick={() => setIsModalOpen(true)}>Login to account</Button>
					<Link to="/registration">
						<Button>Register</Button>
					</Link>
				</div>
			) : (
				<>
					<div className={styles.control_panel_user_container}>
						<div className={styles.user_info}>
							<h3 className={styles.user_name}>{login}</h3>
							<Link to={`/user_account/${user.login}/${user.id}`}>
								{isAdmin ? (
									<img
										src={adminLogo}
										alt="user logo"
										className={styles.admin_logo}
									/>
								) : (
									<img
										src={userLogo}
										alt="user logo"
										className={styles.user_logo}
									/>
								)}
							</Link>
						</div>
						<div className={styles.control_panel_button_container}>
							{isAdmin && (
								<div className={styles.admin_button_container}>
									<Link to="/hotel">
										<Button>Create new hotel</Button>
									</Link>
									<Link to="/admin_page/booking_history">
										<Button>Admin panel</Button>
									</Link>
								</div>
							)}
							<Link to="/">
								<Button onClick={onLogout}>Logout</Button>
							</Link>
						</div>
					</div>
				</>
			)}

			<ModalAuth
				isModalOpen={isModalOpen}
				setIsModalOpen={setIsModalOpen}
				onConfirm={handleAuthConfirm}
				onCancel={handleAuthCancel}
			/>
		</div>
	);
};
