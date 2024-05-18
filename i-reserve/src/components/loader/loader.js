import styles from './loader.module.css';

export const Loader = () => {
	return (
		<div className={styles.loader_container}>
			<div className={styles.loader}></div>
			<div>Loading...</div>
		</div>
	);
};
