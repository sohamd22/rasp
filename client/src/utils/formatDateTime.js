const formatDate = (date) => {
    return (new Date(date)).toLocaleDateString("en-US");
};

const formatTime = (date) => {
    return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
};

export { formatDate, formatTime };