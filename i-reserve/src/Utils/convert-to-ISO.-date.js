import { format, parseISO } from 'date-fns';

export const convertToISODate = (dateString) => {
	const date = new Date(dateString);
	const isoString = date.toISOString();
	const parsedDate = parseISO(isoString);
	const formattedDate = format(parsedDate, "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'");
	return formattedDate;
};
