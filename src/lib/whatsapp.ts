export const WHATSAPP_NUMBER = '5571993559126';

export const redirectToWhatsApp = (message?: string) => {
  const defaultMessage = 'Olá, tenho interesse na vaga de modelo, vim do site quero ser modelo';
  const text = message || defaultMessage;
  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
  window.open(url, '_blank');
};
