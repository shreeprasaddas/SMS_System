export const calculateAttendancePercentage = (present, total) => {
  if (!total || total === 0) return 0;
  return parseFloat(((present / total) * 100).toFixed(2));
};

export const getAttendanceStatusBadgeColor = (status) => {
  switch (status?.toUpperCase()) {
    case 'PRESENT':
      return 'bg-green-100 text-green-800';
    case 'ABSENT':
      return 'bg-red-100 text-red-800';
    case 'LATE':
      return 'bg-yellow-100 text-yellow-800';
    case 'HALF_DAY':
      return 'bg-orange-100 text-orange-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export const getAttendanceSummary = (records = []) => {
  const summary = {
    present: 0,
    absent: 0,
    late: 0,
    halfDay: 0,
    total: records.length,
    percentage: 0,
  };

  records.forEach((record) => {
    switch (record.status?.toUpperCase()) {
      case 'PRESENT':
        summary.present += 1;
        break;
      case 'ABSENT':
        summary.absent += 1;
        break;
      case 'LATE':
        summary.late += 1;
        break;
      case 'HALF_DAY':
        summary.halfDay += 1;
        break;
      default:
        break;
    }
  });

  const presentCount = summary.present + summary.late + (summary.halfDay * 0.5);
  summary.percentage = calculateAttendancePercentage(presentCount, summary.total);

  return summary;
};
