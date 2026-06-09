import Swal from 'sweetalert2';

// Inject custom CSS animations and toast overrides directly to the document head
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
      opacity: 0;
    }
    /* SweetAlert2 Toast Overrides for Pill design alignment */
    .swal2-popup.swal2-toast {
      display: flex !important;
      align-items: center !important;
      flex-direction: row !important;
      padding: 0.75rem 1rem !important;
      box-sizing: border-box !important;
    }
    .swal2-popup.swal2-toast .swal2-html-container {
      margin: 0 !important;
      padding: 0 !important;
      width: 100% !important;
      order: 1 !important; /* Force HTML content to come first */
    }
    .swal2-popup.swal2-toast .swal2-close {
      position: static !important;
      margin-left: auto !important;
      align-self: center !important;
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      width: 24px !important;
      height: 24px !important;
      border: 0 !important;
      background: transparent !important;
      outline: none !important;
      box-shadow: none !important;
      cursor: pointer !important;
      padding: 0 !important;
      order: 2 !important; /* Force Close button to come second (on the right) */
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

// Mixin untuk dialog utama yang seragam
const PremiumSwal = Swal.mixin({
  customClass: commonCustomClass,
  buttonsStyling: false
});

// Toast SweetAlert2 Mixin
const ToastSwal = Swal.mixin({
  toast: true,
  position: 'bottom-end',
  showConfirmButton: false,
  showCloseButton: true,
  closeButtonHtml: `<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>`,
  timer: 4000,
  timerProgressBar: false,
  didOpen: (toast) => {
    toast.addEventListener('mouseenter', Swal.stopTimer);
    toast.addEventListener('mouseleave', Swal.resumeTimer);
  }
});

// Custom Icon HTML (untuk mendapatkan tampilan minimalis tanpa animasi bawaan Swal yang kaku)
const iconSuccess = `<div class="w-14 h-14 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mt-4 swal-icon-anim"><svg class="w-7 h-7 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg></div>`;
const iconError = `<div class="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center mx-auto mt-4 swal-icon-anim"><svg class="w-7 h-7 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg></div>`;
const iconInfo = `<div class="w-14 h-14 bg-blue-50 rounded-full flex items-center justify-center mx-auto mt-4 swal-icon-anim"><svg class="w-7 h-7 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg></div>`;
const iconWarning = `<div class="w-14 h-14 bg-orange-50 rounded-full flex items-center justify-center mx-auto mt-4 swal-icon-anim"><svg class="w-7 h-7 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg></div>`;

// --- TOAST NOTIFICATIONS (Design matching Image 2) ---

export const showToastSuccess = (title, message) => {
  return ToastSwal.fire({
    html: `
      <div class="flex items-center gap-3 w-full">
        <div class="w-8 h-8 bg-emerald-100/80 rounded-full flex items-center justify-center shrink-0">
          <svg class="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg>
        </div>
        <div class="flex flex-col text-left">
          <span class="text-[0.85rem] font-semibold text-emerald-800 leading-tight">${title}</span>
          <span class="text-[0.75rem] font-medium text-emerald-600/70 mt-0.5 leading-snug">${message}</span>
        </div>
      </div>
    `,
    customClass: {
      popup: '!rounded-2xl border border-emerald-200 bg-emerald-50/90 backdrop-blur-md shadow-lg shadow-emerald-100/10 px-4 py-2.5 flex items-center',
      closeButton: 'text-emerald-400 hover:text-emerald-600 focus:outline-none shrink-0',
      htmlContainer: '!m-0 !p-0 w-full',
    }
  });
};

export const showToastError = (title, message) => {
  return ToastSwal.fire({
    html: `
      <div class="flex items-center gap-3 w-full">
        <div class="w-8 h-8 bg-red-100/80 rounded-full flex items-center justify-center shrink-0">
          <svg class="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </div>
        <div class="flex flex-col text-left">
          <span class="text-[0.85rem] font-semibold text-red-800 leading-tight">${title}</span>
          <span class="text-[0.75rem] font-medium text-red-600/70 mt-0.5 leading-snug">${message}</span>
        </div>
      </div>
    `,
    customClass: {
      popup: '!rounded-2xl border border-red-200 bg-red-50/90 backdrop-blur-md shadow-lg shadow-red-100/10 px-4 py-2.5 flex items-center',
      closeButton: 'text-red-400 hover:text-red-600 focus:outline-none shrink-0',
      htmlContainer: '!m-0 !p-0 w-full',
    }
  });
};

export const showToastInfo = (title, message) => {
  return ToastSwal.fire({
    html: `
      <div class="flex items-center gap-3 w-full">
        <div class="w-8 h-8 bg-blue-100/80 rounded-full flex items-center justify-center shrink-0">
          <svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
        </div>
        <div class="flex flex-col text-left">
          <span class="text-[0.85rem] font-semibold text-blue-800 leading-tight">${title}</span>
          <span class="text-[0.75rem] font-medium text-blue-600/70 mt-0.5 leading-snug">${message}</span>
        </div>
      </div>
    `,
    customClass: {
      popup: '!rounded-2xl border border-blue-200 bg-blue-50/90 backdrop-blur-md shadow-lg shadow-blue-100/10 px-4 py-2.5 flex items-center',
      closeButton: 'text-blue-400 hover:text-blue-600 focus:outline-none shrink-0',
      htmlContainer: '!m-0 !p-0 w-full',
    }
  });
};

export const showToastWarning = (title, message) => {
  return ToastSwal.fire({
    html: `
      <div class="flex items-center gap-3 w-full">
        <div class="w-8 h-8 bg-amber-100/80 rounded-full flex items-center justify-center shrink-0">
          <svg class="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
        </div>
        <div class="flex flex-col text-left">
          <span class="text-[0.85rem] font-semibold text-amber-800 leading-tight">${title}</span>
          <span class="text-[0.75rem] font-medium text-amber-600/70 mt-0.5 leading-snug">${message}</span>
        </div>
      </div>
    `,
    customClass: {
      popup: '!rounded-2xl border border-amber-200 bg-amber-50/90 backdrop-blur-md shadow-lg shadow-amber-100/10 px-4 py-2.5 flex items-center',
      closeButton: 'text-amber-400 hover:text-amber-600 focus:outline-none shrink-0',
      htmlContainer: '!m-0 !p-0 w-full',
    }
  });
};


// --- MAIN MODALS (Trigger toast on completion) ---

export const showSuccess = (message) => {
  return PremiumSwal.fire({
    title: 'Sukses!',
    html: message,
    iconHtml: iconSuccess,
    confirmButtonText: 'Selesai',
    customClass: {
      ...commonCustomClass,
      popup: 'rounded-[2rem] shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] border border-emerald-200 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-50/70 via-white to-white pb-6 px-4',
      confirmButton: 'flex-1 bg-emerald-600 text-white rounded-full py-3.5 text-[0.9rem] font-bold hover:bg-emerald-700 transition-all active:scale-[0.98]',
    }
  }).then((result) => {
    // Triggers success toast in bottom-right corner when Selesai is clicked
    if (result.isConfirmed || result.isDismissed) {
      showToastSuccess('Proses Berhasil', message || 'Data telah berhasil disimpan');
    }
    return result;
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
      popup: 'rounded-[2rem] shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] border border-red-200 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-red-50/70 via-white to-white pb-6 px-4',
      confirmButton: 'flex-1 bg-red-600 text-white rounded-full py-3.5 text-[0.9rem] font-bold hover:bg-red-700 transition-all active:scale-[0.98]',
    }
  }).then((result) => {
    // Triggers error toast in bottom-right corner when clicked
    if (result.isConfirmed || result.isDismissed) {
      showToastError('Proses Gagal', message || 'Gagal menyimpan perubahan');
    }
    return result;
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
      popup: 'rounded-[2rem] shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] border border-blue-200 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-50/70 via-white to-white pb-6 px-4',
      confirmButton: 'flex-1 bg-blue-600 text-white rounded-full py-3.5 text-[0.9rem] font-bold hover:bg-blue-700 transition-all active:scale-[0.98]',
    }
  }).then((result) => {
    if (result.isConfirmed || result.isDismissed) {
      showToastInfo('Informasi', message);
    }
    return result;
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
      popup: 'rounded-[2rem] shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] border border-orange-200 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-orange-50/70 via-white to-white pb-6 px-4',
      confirmButton: 'flex-1 bg-orange-500 text-white rounded-full py-3.5 text-[0.9rem] font-bold hover:bg-orange-600 transition-all active:scale-[0.98]',
    }
  });
  return result.isConfirmed;
};
