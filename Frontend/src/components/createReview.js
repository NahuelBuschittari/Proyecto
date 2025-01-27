const createReview=async()=>{
    try{
        const reviewData={
            parking:selectedParking.userData.id,
            driver:driverId
        }
        const response=await fetch(url,{
            method:'POST',
            headers:{
                'Content-Type':'application/json',
            },
            body:JSON.stringify(reviewData),
        });
        if (!response.ok) {
            throw new Error('Error en el registro');
        }
        const data = await response.json();
        console.log(data);
    }catch(error){
        console.error(error);}
};