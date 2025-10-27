
function startDateDays (days) {
    const now = new Date();
    const daysBack = new Date(now);
    daysBack.setDate(now.getDate() - days);
    const formattedDate = daysBack.toISOString().slice(0, 19).replace('T', ' ');
    const startDate = encodeURIComponent(formattedDate);

    return startDate;
}

module.exports = { startDateDays };

