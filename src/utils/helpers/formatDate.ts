import moment from 'moment';

const formatDate = (isoDate: string): string => {
  const parsedDate = moment(isoDate);

  if (!parsedDate.isValid()) {
    throw new Error(
      'Invalid date format. Please provide a valid ISO date string.'
    );
  }

  return parsedDate.format('DD MMM YYYY');
};

try {
  const formattedDate = formatDate('2024-11-10T06:28:08.799Z');
  console.log(formattedDate);

  formatDate('invalid-date');
} catch (error: unknown) {
  if (error instanceof Error) {
    console.error('Error:', error.message);
  } else {
    console.error('An unknown error occurred');
  }
}

export default formatDate;
