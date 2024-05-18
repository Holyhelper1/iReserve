import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import styles from './hotel-card.module.css';

export const HotelCard = ({ id, name, image, stars, rooms }) => {
	return (
		<div className={styles.hotel_card_container}>
			<div key={id} className={styles.card_choice}>
				<Link to={`/hotel/${id}`}>
					<img className={styles.card_choice_picture} src={image} alt="room" />
				</Link>
				<div className={styles.hotel_promotion_info}>
					<div>
						<div className={styles.hotel_name}>{name}</div>
						<div>⭐{stars}</div>
						<div> </div>
						<div>available rooms : {rooms.length} </div>
					</div>
				</div>
			</div>
		</div>
	);
};

HotelCard.propTypes = {
	id: PropTypes.string.isRequired,
	name: PropTypes.string.isRequired,
	image: PropTypes.string.isRequired,
	stars: PropTypes.number.isRequired,
	rooms: PropTypes.array.isRequired,
};
