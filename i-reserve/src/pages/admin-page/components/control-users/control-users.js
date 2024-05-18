import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import styles from './control-users.module.css';
import { request } from '../../../../Utils/request';
import { Button, SuccessMessage } from '../../../../components';

export const ControlUsers = ({ allUsers }) => {
	const [selectedUser, setSelectedUser] = useState(null);
	const [initialRoleId, setInitialRoleId] = useState(null);
	const [selectedRoleId, setSelectedRoleId] = useState(null);
	const [successMessage, setSuccessMessage] = useState(false);

	const ROLE = {
		Admin: 0,
		Moderator: 1,
		Client: 2,
	};

	useEffect(() => {
		let timeout;
		if (successMessage) {
			timeout = setTimeout(() => {
				setSuccessMessage(false);
			}, 3000);
		}
		return () => clearTimeout(timeout);
	}, [successMessage]);

	const handleUserChange = (event) => {
		const userId = event.target.value;
		const selectedUser = allUsers.find((user) => user.id === userId);
		setSelectedUser(selectedUser);
		setInitialRoleId(selectedUser ? selectedUser.role : null);
		setSelectedRoleId(selectedUser ? selectedUser.role : null);
	};

	const handleRoleChange = ({ target }) => {
		setSelectedRoleId(Number(target.value));
	};

	const onRoleSave = (userId, newUserRoleId) => {
		if (selectedUser && newUserRoleId !== null) {
			request(`/users/${userId}`, 'PATCH', { role: newUserRoleId }).then(() => {
				setInitialRoleId(newUserRoleId);
			});
		}
	};

	const isSaveButtonDisabled =
		selectedRoleId === initialRoleId || selectedRoleId === null;

	return (
		<div className={styles.container}>
			<h2 className={styles.heading}>Change users role</h2>
			<select className={styles.select} onChange={handleUserChange}>
				<option value="">Choose user</option>
				{allUsers.map((user) => (
					<option key={user.id} value={user.id}>
						{user.name} (
						{Object.keys(ROLE).find((key) => ROLE[key] === user.role)})
					</option>
				))}
			</select>
			{selectedUser && (
				<div className={styles.userDetails}>
					<h3 className={styles.userName}>{selectedUser.name}</h3>
					<label className={styles.label}>
						<div className={styles.label}>New role:</div>
						<select
							className={styles.select}
							value={selectedRoleId}
							onChange={handleRoleChange}
						>
							{Object.entries(ROLE).map(([key, value]) => (
								<option key={key} value={value}>
									{key}
								</option>
							))}
						</select>
					</label>
					<div className={styles.buttonContainer}>
						<Button
							disabled={isSaveButtonDisabled}
							onClick={() => {
								onRoleSave(selectedUser.id, selectedRoleId);
								setSuccessMessage(!successMessage);
							}}
						>
							Save new role
						</Button>
						<div className={styles.successMessage_container}>
							{successMessage && (
								<SuccessMessage children={'Successfully saved'} />
							)}
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

ControlUsers.propTypes = {
	allUsers: PropTypes.arrayOf(PropTypes.object).isRequired,
};
