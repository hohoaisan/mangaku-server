const allStatus = {
  pending: 'PENDING',
  approved: 'APPROVED',
  rejected: 'REJECTED',
};

const statuses = Object.keys(allStatus);

module.exports = {
  statuses,
  status: allStatus,
};
