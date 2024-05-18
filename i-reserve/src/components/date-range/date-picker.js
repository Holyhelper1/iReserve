import PropTypes from 'prop-types';
import { useState, useEffect, useRef } from 'react';
import { DateRange } from 'react-date-range';
import styles from './date-picker.module.css';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import { format } from 'date-fns';
import { Button } from '../Button/button';

export const DatePicker = ({ onCheckInChange, onCheckOutChange }) => {
	const [showCalender, setShowCalender] = useState(false);
	const [date, setDate] = useState({
		startDate: new Date(),
		endDate: new Date(),
		key: 'selection',
	});

	const refOne = useRef(null);

	const handleStartDateChange = (ranges) => {
		setDate(ranges.selection);
		onCheckInChange(ranges.selection.startDate);
		onCheckOutChange(ranges.selection.endDate);
	};

	const handleClickOpenClose = () => {
		setShowCalender(!showCalender);
	};

	const handleClear = () => {
		setDate({ startDate: new Date(), endDate: new Date(), key: 'selection' });
		onCheckInChange(null);
		onCheckOutChange(null);
	};

	useEffect(() => {
		const handleClickOutside = (event) => {
			if (refOne.current && !refOne.current.contains(event.target)) {
				setShowCalender(false);
			}
		};

		if (showCalender) {
			document.addEventListener('click', handleClickOutside, true);
		}

		return () => {
			document.removeEventListener('click', handleClickOutside, true);
		};
	}, [showCalender]);

	return (
		<div className={styles.calender_wrapper}>
			<div className={styles.show_calender_container}>
				<span className={styles.show_calender} onClick={handleClickOpenClose}>
					{`${format(date.startDate, 'dd.MMM.yyyy')} - ${format(
						date.endDate,
						'dd.MMM.yyyy',
					)}`}
				</span>
			</div>
			{showCalender && (
				<div ref={refOne} className={styles.calender_container}>
					<DateRange
						ranges={[date]}
						weekStartsOn={1}
						editableDateInputs={true}
						months={2}
						direction="horizontal"
						minDate={new Date()}
						maxDate={
							new Date(
								new Date().getFullYear() + 1,
								new Date().getMonth(),
								new Date().getDate(),
							)
						}
						onChange={handleStartDateChange}
					/>
					<div className={styles.button_confirm_date}>
						<Button onClick={handleClear}>Clear</Button>
						<Button onClick={handleClickOpenClose}>Confirm</Button>
					</div>
				</div>
			)}
		</div>
	);
};

DatePicker.propTypes = {
	onCheckInChange: PropTypes.func.isRequired,
	onCheckOutChange: PropTypes.func.isRequired,
};
