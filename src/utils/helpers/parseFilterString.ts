export const parseFilterString = (filterString?: string) => {
  if (!filterString) return {};

  return filterString
    .split('&')
    .reduce((acc: Record<string, unknown>, curr) => {
      const [key, value] = curr.split('=');
      if (key && value) {
        // Split the value by comma
        const values = value.split(',').map((item) => {
          const trimmedValue = item.trim();

          // Handle category field with capitalization for multi-word categories
          if (key === 'category') {
            // Split into words, capitalize first letter of each word, then join
            return trimmedValue
              .split(' ')
              .map(
                (word) =>
                  word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
              )
              .join(' ');
          }

          return trimmedValue;
        });

        acc[key] = { $in: values };
      }
      return acc;
    }, {});
};
