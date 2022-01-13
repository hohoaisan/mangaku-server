const allStatus = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
};

const statuses = Object.values(allStatus);

module.exports = {
  statuses,
  status: allStatus,
};
