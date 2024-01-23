const formatDeliveryStatus = (status: string) => {
  switch (status) {
    case 'inprogress':
      return "in progress";
    case 'cannotdeliver':
      return "cannot deliver";
    default:
      return status; 
  }
};

export default formatDeliveryStatus;