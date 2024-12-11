const getAvailableParkings=async(dummyParkingData, type, currentDay) =>{

    // Obtener el día actual y la hora actual
    const currentDate = new Date();
//     const currentDateString = currentDate.toISOString().split('T')[0];
//     const year=currentDate.getFullYear();
//   // Obtener los feriados para el año actual
//   const holidaysResponse = await fetch(`https://api.argentinadatos.com/v1/feriados/${year}`);
//   const holidays = await holidaysResponse.json();
  
//   // Verificar si es feriado
//   const isHoliday = holidays.some(holiday => holiday.fecha === currentDateString);
  
//   // Determinar el día de la semana
//   const currentDay = isHoliday ? 'F' : ['D', 'L', 'Ma', 'Mi', 'J', 'V', 'S'][currentDate.getDay()];
  const currentTime = currentDate.toTimeString().slice(0, 5); // HH:mm formato

  // Filtrar los estacionamientos
  return dummyParkingData.filter(parking => {
      // Filtrar por capacidades según el tipo de vehículo
      let hasCapacity = false;
      if (type === 'car-side' || type === 'truck-pickup') {
          hasCapacity = parseInt(parking.capacities.carCapacity) > 0;
      } else if (type === 'motorcycle') {
          hasCapacity = parseInt(parking.capacities.motoCapacity) > 0;
      } else if (type === 'bicycle') {
          hasCapacity = parseInt(parking.capacities.bikeCapacity) > 0;
      }

      // Verificar si está abierto en el horario actual
      const schedule = parking.schedule[currentDay];
      if (!schedule) return false; // Si no hay horario para el día actual, no está abierto

      const { openTime, closeTime } = schedule;
      const isOpen = currentTime >= openTime && currentTime <= closeTime;

      return hasCapacity && isOpen;
  });
};
export default getAvailableParkings;