import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import '../src/adit.css'
const AdminPage = () => {
  const [users, setUsers] = useState([]);
  const [file, setFile] = useState(null);

  const fetchUsers = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/users');
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      console.error('Gagal fetch users', err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDeleteUser = async (id) => {
    const confirm = await Swal.fire({
      title: 'Yakin hapus user ini?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Ya, hapus!',
    });

    if (confirm.isConfirmed) {
      await fetch(`http://localhost:5000/api/users/${id}`, {
        method: 'DELETE',
      });
      fetchUsers();
      Swal.fire('Dihapus!', 'User berhasil dihapus.', 'success');
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      return Swal.fire('Pilih file Excel terlebih dahulu');
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('http://localhost:5000/api/excel', {
        method: 'POST',
        body: formData,
      });

      if (res.ok) {
        Swal.fire('Berhasil!', 'User berhasil diimport.', 'success');
        setFile(null);
        fetchUsers();
      } else {
        Swal.fire('Gagal!', 'Import gagal.', 'error');
      }
    } catch (error) {
      console.error('Gagal upload:', error);
      Swal.fire('Error!', 'Terjadi kesalahan saat upload.', 'error');
    }
  };

  return (
    <div className="container bg-dark text-white py-4 min-vh-100 admin">
      <h3 className="text-center mb-4">👑 Admin Panel</h3>

      {/* Upload Excel */}
      <form onSubmit={handleUpload} className="mb-4">
        <div className="input-group">
          <input
            type="file"
            accept=".xlsx"
            onChange={(e) => setFile(e.target.files[0])}
            className="form-control"
          />
          <button type="submit" className="btn btn-primary">
            Import Excel
          </button>
        </div>
      </form>

      {/* Table User */}
      <table className="table table-dark table-bordered text-center">
        <thead className="table-light text-dark">
          <tr>
            <th>ID</th>
            <th>Username</th>
            <th>Email</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {users.length > 0 ? (
            users.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.username}</td>
                <td>{user.email}</td>
                <td>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => handleDeleteUser(user.id)}
                  >
                    Hapus
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5">Tidak ada user.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AdminPage;
