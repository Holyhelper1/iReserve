import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../../image/Logo2.png';
import styles from './header.module.css';
import { HeaderControlPanel } from './components';
export const Header = () => {
	return (
		<div className={styles.header_container}>
			<div className={styles.header_top}>
				<div className={styles.header_links}>
					<Link to="/">
						<div className={styles.header_logo}>
							<img
								className={styles.header_logo_img}
								src={logo}
								alt="logo"
							/>
							iReserve
						</div>
					</Link>
					<div className={styles.header_contact_link}>
						<Link to="/contacts">
							<div>Our contacts</div>
						</Link>
					</div>
				</div>
			</div>
			<div className={styles.header_middle}>
				<div>Call us now!</div>
				<div className={styles.header_phone}>8 800 555-35-35</div>
			</div>
			<HeaderControlPanel />
		</div>
	);
};
