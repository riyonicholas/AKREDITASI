import Swal from 'sweetalert2';

const commonCustomClass = {
  popup: 'rounded-[2rem] shadow-2xl shadow-slate-200/50 border border-slate-100 bg-white bg-gradient-to-b from-slate-50/80 to-white pb-6 px-4',
  title: 'text-xl font-black text-slate-800 mt-2 tracking-tight',
  htmlContainer: 'text-[0.9rem] font-medium text-slate-500 mt-1 mb-6 px-4',
  icon: 'border-0 !my-6',
  actions: 'flex gap-3 w-full px-6',
  confirmButton: 'flex-1 bg-slate-900 text-white rounded-2xl py-3.5 text-sm font-bold hover:bg-slate-800 transition-all shadow-md active:scale-[0.98]',
  cancelButton: 'flex-1 bg-slate-100 text-slate-700 rounded-2xl py-3.5 text-sm font-bold hover:bg-slate-200 transition-all active:scale-[0.98]'
};

// Mixin untuk desain premium yang seragam
const PremiumSwal = Swal.mixin({
  customClass: commonCustomClass,
  buttonsStyling: false
});

// Custom Icon HTML (untuk mendapatkan tampilan minimalis tanpa animasi bawaan Swal yang kaku)
const iconSuccess = `<div class="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center shadow-inner mx-auto"><svg class="w-8 h-8 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg></div>`;
const iconError = `<div class="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center shadow-inner mx-auto"><svg class="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg></div>`;
const iconInfo = `<div class="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center shadow-inner mx-auto"><svg class="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg></div>`;
const iconWarning = `<div class="w-16 h-16 bg-orange-50 rounded-full flex items-center justify-center shadow-inner mx-auto"><svg class="w-8 h-8 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg></div>`;

export const showSuccess = (message) => {
  return PremiumSwal.fire({
    title: 'Sukses!',
    html: message,
    iconHtml: iconSuccess,
    confirmButtonText: 'Tutup',
    customClass: {
      ...commonCustomClass,
      popup: 'rounded-[2rem] shadow-2xl shadow-emerald-200/40 border border-emerald-100 bg-white bg-gradient-to-b from-emerald-50/50 to-white pb-6 px-4',
    }
  });
};

export const showError = (message) => {
  return PremiumSwal.fire({
    title: 'Gagal',
    html: message,
    iconHtml: iconError,
    confirmButtonText: 'Tutup',
    customClass: {
      ...commonCustomClass,
      popup: 'rounded-[2rem] shadow-2xl shadow-red-200/40 border border-red-100 bg-white bg-gradient-to-b from-red-50/50 to-white pb-6 px-4',
    }
  });
};

export const showInfo = (message) => {
  return PremiumSwal.fire({
    title: 'Informasi',
    html: message,
    iconHtml: iconInfo,
    confirmButtonText: 'Tutup',
    customClass: {
      ...commonCustomClass,
      popup: 'rounded-[2rem] shadow-2xl shadow-blue-200/40 border border-blue-100 bg-white bg-gradient-to-b from-blue-50/50 to-white pb-6 px-4',
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
      popup: 'rounded-[2rem] shadow-2xl shadow-slate-200/50 border border-slate-100 bg-white bg-gradient-to-b from-slate-50/80 to-white pb-6 px-4',
      confirmButton: 'flex-1 bg-red-600 text-white rounded-2xl py-3.5 text-sm font-bold hover:bg-red-700 transition-all shadow-md active:scale-[0.98]',
    }
  });
  return result.isConfirmed;
};
