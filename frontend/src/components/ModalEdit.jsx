'use client';

import * as Dialog from '@radix-ui/react-dialog';

export default function ModalEdit() {
    return (
        <Dialog.Root>
            {/* Tombol yang memicu modal muncul */}
            <Dialog.Trigger asChild>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                    Edit Profil
                </button>
            </Dialog.Trigger>

            <Dialog.Portal>
                {/* Latar belakang hitam transparan */}
                <Dialog.Overlay className="fixed inset-0 bg-black/50" />

                {/* Konten Utama Modal */}
                <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg shadow-xl w-[400px]">
                    <Dialog.Title className="text-xl font-bold mb-2">Edit Data</Dialog.Title>
                    <Dialog.Description className="text-gray-500 mb-4">
                        Ubah informasi profil kamu di sini.
                    </Dialog.Description>

                    {/* Isi Form kamu */}
                    <input className="w-full border p-2 mb-4 rounded" placeholder="Nama Lengkap" />

                    <div className="flex justify-end gap-3">
                        <Dialog.Close asChild>
                            <button className="px-4 py-2 bg-gray-200 rounded">Batal</button>
                        </Dialog.Close>
                        <button className="px-4 py-2 bg-blue-600 text-white rounded">Simpan</button>
                    </div>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
}
