import PropTypes from 'prop-types';
import styles from './search.module.css';
const { Input } = require('../../../../components');

export const Search = ({ searchPhrase, searchStars, onChange, onChangeStars }) => {
	return (
		<>
			<div className={styles.search_container}>
				<Input
					value={searchPhrase}
					placeholder="Поиск по названию отеля..."
					onChange={onChange}
				/>
				<select
					className={styles.search_stars_select}
					value={searchStars}
					onChange={onChangeStars}
				>
					<option value="">All stars</option>
					{[1, 2, 3, 4, 5].map((star) => (
						<option key={star} value={star}>
							{star}
						</option>
					))}
				</select>
				<div className={styles.search_icon}>⌕</div>
			</div>
		</>
	);
};

Search.propTypes = {
	searchPhrase: PropTypes.string.isRequired,
	searchStars: PropTypes.string.isRequired,
	onChange: PropTypes.func.isRequired,
	onChangeStars: PropTypes.func.isRequired,
};
