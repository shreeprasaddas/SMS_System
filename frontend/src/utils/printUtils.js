export const printElement = (elementId) => {
  const printContents = document.getElementById(elementId)?.innerHTML;
  if (!printContents) {
    console.error('Element to print not found:', elementId);
    return;
  }
  
  const originalContents = document.body.innerHTML;
  
  // Replace body contents with element contents
  document.body.innerHTML = printContents;
  
  // Trigger print dialog
  window.print();
  
  // Restore original contents
  document.body.innerHTML = originalContents;
  
  // Reload page to re-bind React events and lifecycle
  window.location.reload();
};

export const printUrl = (url) => {
  const printWindow = window.open(url, '_blank');
  if (printWindow) {
    printWindow.onload = () => {
      printWindow.print();
    };
  }
};
