const formatOfferStatus = (status: string) => {
    switch (status) {
      case 'waitingfordecision':
        return "waiting for decision";
      case 'pickedup':
        return "picked up";
      case 'cannotdeliver':
        return "cannot deliver";
      default:
        return status; 
    }
};

export default formatOfferStatus;