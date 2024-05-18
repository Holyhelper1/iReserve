import styles from './footer.module.css';
import logo from '../../image/Logo.png';
import { WeatherBlock } from '../weather-block/weather-block';
export const Footer = () => {
	return (
		<div className={styles.footer_container}>
			<div className={styles.footer_logo}>
				<img className={styles.footer_logo_img} src={logo} alt="logo" />
				<div className={styles.footer_naming}>iReserve</div>
			</div>
			<div className={styles.footer_text}>
				© 2024 iReserve.com. All rights reserved.
			</div>
			<div>
				<h3 className={styles.footer_h3}>Mobile app</h3>
				<a href="https://play.google.com/" target="_blank" rel="noreferrer">
					<img
						src="https://101hotels.com/images/new_version/google_pay.svg"
						alt="play google"
					/>
				</a>
				<a
					href="https://www.apple.com/app-store/"
					target="_blank"
					rel="noreferrer"
				>
					<img
						src="https://101hotels.com/images/new_version/app_store.svg"
						alt="app store"
					/>
				</a>
			</div>
			<WeatherBlock />
		</div>
	);
};
