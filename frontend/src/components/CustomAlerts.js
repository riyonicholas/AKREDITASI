import Swal from 'sweetalert2';

// Inject custom CSS animations directly to the document head
if (typeof document !== 'undefined' && !document.getElementById('custom-alert-styles')) {
  const style = document.createElement('style');
  style.id = 'custom-alert-styles';
  style.innerHTML = `
    @keyframes swalSpringPop {
      0% { transform: scale(0.3); opacity: 0; }
      60% { transform: scale(1.15); opacity: 1; }
      100% { transform: scale(1); opacity: 1; }
    }
    @keyframes swalSlideUpFade {
      0% { transform: translateY(15px); opacity: 0; }
      100% { transform: translateY(0); opacity: 1; }
    }
    .swal-icon-anim {
      animation: swalSpringPop 0.6s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
    }
    .swal-text-anim {
      animation: swalSlideUpFade 0.5s ease-out 0.1s forwards;
      opacity: 0; /* starts hidden until animation begins */
    }
  `;
  document.head.appendChild(style);
}

const commonCustomClass = {
  popup: 'rounded-[2rem] shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] border border-slate-100 bg-white pb-6 px-4',
  title: 'text-xl font-bold text-slate-900 mt-2 tracking-tight swal-text-anim',
  htmlContainer: 'text-[0.9rem] font-medium text-slate-500 mt-2 mb-8 px-4 swal-text-anim',
  icon: 'border-0 !my-6',
  actions: 'flex gap-3 w-full px-6 justify-center swal-text-anim',
  confirmButton: 'flex-1 bg-slate-900 text-white rounded-full py-3.5 text-[0.9rem] font-bold hover:bg-slate-800 transition-all active:scale-[0.98]',
  cancelButton: 'flex-1 bg-slate-100 text-slate-700 rounded-full py-3.5 text-[0.9rem] font-bold hover:bg-slate-200 transition-all active:scale-[0.98]'
};

// Mixin untuk desain premium yang seragam
const PremiumSwal = Swal.mixin({
  customClass: commonCustomClass,
  buttonsStyling: false
});

// Custom Icon HTML (untuk mendapatkan tampilan minimalis tanpa animasi bawaan Swal yang kaku)
const iconSuccess = `<div class="w-14 h-14 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mt-4 swal-icon-anim"><svg class="w-7 h-7 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg></div>`;
const iconError = `<div class="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center mx-auto mt-4 swal-icon-anim"><svg class="w-7 h-7 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg></div>`;
const iconInfo = `<div class="w-14 h-14 bg-blue-50 rounded-full flex items-center justify-center mx-auto mt-4 swal-icon-anim"><svg class="w-7 h-7 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg></div>`;
const iconWarning = `<div class="w-14 h-14 bg-orange-50 rounded-full flex items-center justify-center mx-auto mt-4 swal-icon-anim"><svg class="w-7 h-7 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg></div>`;

export const showSuccess = (message) => {
  return PremiumSwal.fire({
    title: 'Sukses!',
    html: message,
    iconHtml: iconSuccess,
    confirmButtonText: 'Selesai',
    customClass: {
      ...commonCustomClass,
      popup: 'rounded-[2rem] shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] border border-slate-100 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-50/70 via-white to-white pb-6 px-4',
    }
  });
};

export const showError = (message) => {
  return PremiumSwal.fire({
    title: 'Gagal',
    html: message,
    iconHtml: iconError,
    confirmButtonText: 'Selesai',
    customClass: {
      ...commonCustomClass,
      popup: 'rounded-[2rem] shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] border border-slate-100 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-red-50/70 via-white to-white pb-6 px-4',
    }
  });
};

export const showInfo = (message) => {
  return PremiumSwal.fire({
    title: 'Informasi',
    html: message,
    iconHtml: iconInfo,
    confirmButtonText: 'Selesai',
    customClass: {
      ...commonCustomClass,
      popup: 'rounded-[2rem] shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] border border-slate-100 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-50/70 via-white to-white pb-6 px-4',
    }
  });
};

export const showConfirm = async (message, confirmText = 'Lanjutkan') => {
  const result = await PremiumSwal.fire({
    title: 'Konfirmasi',
    html: message,
    iconHtml: iconWarning,
    showCancelButton: true,
    confirmButtonText: confirmText,
    cancelButtonText: 'Batal',
    customClass: {
      ...commonCustomClass,
      popup: 'rounded-[2rem] shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] border border-slate-100 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-50/70 via-white to-white pb-6 px-4',
      confirmButton: 'flex-1 bg-slate-900 text-white rounded-full py-3.5 text-[0.9rem] font-bold hover:bg-slate-800 transition-all active:scale-[0.98]',
    }
  });
  return result.isConfirmed;
};
