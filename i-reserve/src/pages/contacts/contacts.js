import styles from './contacts.module.css';

export const Contacts = () => {
	return (
		<div className={styles.contacts_container}>
			<div className={styles.contacts_content}>
				<h1 className={styles.contacts_title}>Contacts</h1>
				<p className={styles.contacts_text}>All contacts</p>
				<p className={styles.contacts_text}>
					{' '}
					Booking department : 8 800 555-35-35
				</p>
				<p className={styles.contacts_text}>
					Email:{' '}
					<a href="mailto:BookingNow@example.com">BookingNow@example.com</a>
				</p>
				<p className={styles.contacts_text}>
					Central office address: Nizhny Novgorod, 603000, Russia
				</p>
			</div>
			<div className={styles.iframe_wrapper}>
				<iframe
					className={styles.iframe}
					src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d878.0385416418524!2d44.02926080286835!3d56.320883638614276!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4151d45999d3014b%3A0x6c430bc43b52ca15!2sHampton%20by%20Hilton%20Nizhny%20Novgorod!5e0!3m2!1sru!2sru!4v1715521923243!5m2!1sru!2sru"
					width="800"
					height="450"
					style={{ border: 0 }}
					allowFullScreen
					loading="lazy"
					referrerPolicy="no-referrer-when-downgrade"
					title="Google Maps"
				></iframe>
			</div>
			<div className={styles.contacts_content}>
				{' '}
				<h2 className={styles.video_text}>Our new opening hotel! Coming soon!</h2>
			</div>
			<div className={styles.iframe_video_wrapper}>
				<iframe
					width="738"
					height="415"
					src="https://www.youtube.com/embed/y65N3laM8_Q?si=SF5Q_hZo5k4cZko8"
					title="YouTube video player"
					frameBorder="0"
					allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
					referrerPolicy="strict-origin-when-cross-origin"
					allowFullScreen
				></iframe>
			</div>
		</div>
	);
};
