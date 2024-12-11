const getDay = async () => {
    const currentDate = new Date();
    const currentDateString = currentDate.toISOString().split('T')[0];
    const year = currentDate.getFullYear();

    const holidaysResponse = await fetch(`https://api.argentinadatos.com/v1/feriados/${year}`);
    const holidays = await holidaysResponse.json();

    const isHoliday = holidays.some(holiday => holiday.fecha === currentDateString);
    return isHoliday ? 'F' : ['D', 'L', 'Ma', 'Mi', 'J', 'V', 'S'][currentDate.getDay()];
};

export default getDay;
