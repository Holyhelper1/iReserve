import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import {
	selectModalIsOpen,
	selectModalOnCancel,
	selectModalOnConfirm,
	selectModalText,
} from '../../selectors';
import { Button } from '../Button/button';
import styles from './modal.module.css';

export const Modal = () => {
	const isOpen = useSelector(selectModalIsOpen);
	const text = useSelector(selectModalText);
	const onConfirm = useSelector(selectModalOnConfirm);
	const onCancel = useSelector(selectModalOnCancel);

	if (!isOpen) {
		return null;
	}

	return (
		<div className={styles.modal}>
			<div className={styles.modal_overlay}></div>
			<div className={styles.modal_box}>
				<h3 className={styles.modal_h3_text}>{text}</h3>
				<div className={styles.modal_buttons_container}>
					<Button onClick={onConfirm}>Yes</Button>
					<Button onClick={onCancel}>Cancel</Button>
				</div>
			</div>
		</div>
	);
};

Modal.propTypes = {
	isOpen: PropTypes.bool,
	text: PropTypes.string,
	onConfirm: PropTypes.func,
	onCancel: PropTypes.func,
}
