import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

export function showSuccess(message: string) {
  MySwal.fire({
    icon: 'success',
    title: 'Berhasil',
    text: message,
    timer: 2000,
    showConfirmButton: false,
  });
}

export function showError(message: string) {
  MySwal.fire({
    icon: 'error',
    title: 'Gagal',
    text: message,
  });
}

export function showConfirm(message: string): Promise<boolean> {
  return MySwal.fire({
    title: 'Konfirmasi',
    text: message,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Ya',
    cancelButtonText: 'Batal',
  }).then((res) => res.isConfirmed);
}