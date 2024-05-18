import PropTypes from 'prop-types';
import { Button, H2 } from '../../../../components';
import { SpecialPanel } from '../special-panel/special-panel';
import { useNavigate } from 'react-router-dom';
import styles from './hotel-content.module.css';

export const HotelContent = ({
	hotel: { id, name, image, description, createdAt, stars },
}) => {
	const navigate = useNavigate();

	return (
		<div className={styles.hotel_content_wrapper}>
			<div className={styles.image_hotel_wrapper}>
				<img className={styles.image_hotel_content} src={image} alt={name} />
			</div>
			<div className={styles.info_hotel_name}>
				<H2>
					{name}⭐️{stars} stars
				</H2>
			</div>
			<div className={styles.info_hotel_description}>{description}</div>
			<div className={styles.info_hotel_buttons}>
				<SpecialPanel
					id={id}
					createdAt={createdAt}
					editButton={
						<Button onClick={() => navigate(`/hotel/${id}/edit`)}>
							Edit Hotel
						</Button>
					}
				/>
			</div>
		</div>
	);
};

HotelContent.propTypes = {
	hotel: PropTypes.object.isRequired,
}
