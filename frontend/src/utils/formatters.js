import dayjs from 'dayjs';

export const formatCurrency = (amount, currencySymbol = 'Rs.') => {
  if (amount === undefined || amount === null) return `${currencySymbol} 0.00`;
  return `${currencySymbol} ${parseFloat(amount).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

export const formatDate = (date, formatStr = 'MMM DD, YYYY') => {
  if (!date) return '';
  return dayjs(date).format(formatStr);
};

export const formatDateTime = (date, formatStr = 'MMM DD, YYYY hh:mm A') => {
  if (!date) return '';
  return dayjs(date).format(formatStr);
};

export const formatPhoneNumber = (phone) => {
  if (!phone) return '';
  const cleaned = ('' + phone).replace(/\D/g, '');
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
  if (match) {
    return '(' + match[1] + ') ' + match[2] + '-' + match[3];
  }
  return phone;
};

export const getInitials = (name) => {
  if (!name) return '';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
};

export const capitalize = (str) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};
