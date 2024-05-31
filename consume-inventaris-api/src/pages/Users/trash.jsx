import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Case from "../../components/case";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Swal from 'sweetalert2';

export default function TrashUsers() {
  const [trashs, setTrashs] = useState([]);
  const [error, setError] = useState([]);
  const navigate = useNavigate();

  const instance = axios.create({
    baseURL: "http://localhost:8000/",
    headers: {
      Authorization: "Bearer " + localStorage.getItem("access_token"),
    },
  });

  useEffect(() => {
    instance
      .get("users/trash", {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("access_token"),
        },
      })
      .then((res) => {
        setTrashs(res.data.data);
      })
      .catch((err) => {
        if (err.response.status === 401) {
          navigate("/login?message=" + encodeURIComponent("Anda belum login!"));
        }
      });
  }, [navigate]);

  const restoreUsers = (id) => {
    instance
      .get(`users/trash/restore/${id}`, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("access_token"),
        },
      })
      .then(() => {
        Swal.fire({
          title: 'Apakah kamu yakin?',
          text: "Item akan direstore!",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Ya, restore!',
          cancelButtonText: 'Batal'
        })
        .then((result) => {
          if (result.isConfirmed) {
            Swal.fire({
              title: 'Berhasil!',
              text: 'Data berhasil direstore!',
              icon: 'success',
              confirmButtonColor: '#3085d6',
              confirmButtonText: 'Ya',
            })
            .then((res) => {
              setTrashs(trashs.filter((user) => user.id !== id));
              navigate("/users");
            });
          }
        })
        .catch((err) => {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Ada kesalahan saat melakukan restore item.',
            footer: '<a href="#">Hubungi admin jika masalah persist.</a>'
          });
          console.error(err);
        });
      })
      .catch((err) => {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Ada kesalahan saat mengakses server.',
          footer: '<a href="#">Hubungi admin jika masalah persist.</a>'
        });
        console.error(err);
      });
  };
  

  const deleteUsers = (id) => {
    Swal.fire({
        title: 'Apakah kamu yakin?',
        text: "Item akan dihapus secara permanen!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Ya, hapus!',
        cancelButtonText: 'Batal'
    }).then((result) => {
        if (result.isConfirmed) {
            // Melakukan request delete
            instance.get(`users/trash/permanent-delete/${id}`)
                .then(res => {
                    // Refresh halaman setelah berhasil menghapus
                    // location.reload();
                    // Menampilkan pesan berhasil dengan timer 3 detik
                    Swal.fire({
                        title: 'Berhasil!',
                        text: 'Data berhasil dihapus.',
                        icon: 'success',
                        confirmButtonColor: '#3085d6',
                        cancelButtonColor: '#d33',
                        confirmButtonText: 'Ya',
                    }).then((result) => {
                        location.reload();
                    })
                })
                .catch(err => {
                    // Menampilkan pesan error jika gagal
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: 'Ada kesalahan saat menghapus item.',
                        footer: '<a href="#">Hubungi admin jika masalah persist.</a>'
                    });
                });
            }
        });
    };

  return (
    <Case>
      <div className="block m-auto bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
        <div className="items-center m-5 pb-10 pt-10">
          <div className="flex justify-between">
            <h5 className="mb-1 ml-5 text-3xl font-medium text-gray-900 dark:text-white">Trash Users</h5>
            <div className="flex justify-end">
              <Link to='/users' className="px-4 py-2 bg-teal-700 text-white shadow-md border-sky-500 rounded-lg">Back to Users</Link>
            </div>
          </div>
          {Object.keys(error).length > 0 && (
            <div role="alert">
              <div className="bg-red-500 text-white font-bold rounded-t px-4 py-2">Gagal!</div>
              <div className="border border-t-0 border-red-400 rounded-b bg-red-100 px-4 py-3 text-red-700">
                <ul>{error.message}</ul>
              </div>
            </div>
          )}
          <div className="flex mt-4 md:mt-6">
                        <table className="min-w-full text-left text-sm font-light">
                            <thead className="border-b font-medium dark:border-neutral-500 text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                <tr>
                                    <th scope="col" className="px-6 py-4">No</th>
                                    <th scope="col" className="px-6 py-4">Username</th>
                                    <th scope="col" className="px-6 py-4">Email</th>
                                    <th scope="col" className="px-6 py-4">Role</th>
                                    <th scope="col" className="px-6 py-4">Action</th>
                                </tr>
                            </thead>
                            <tbody className="text-black">
                                {trashs.map((user, id) => (
                                    <tr key={user.id} className="border-b dark:border-neutral-500">
                                        <td className="whitespace-nowrap px-6 py-4">{id+1}</td>
                                        <td className="whitespace-nowrap px-6 py-4">{user.username}</td>
                                        <td className="whitespace-nowrap px-6 py-4">{user.email}</td>
                                        <td className="whitespace-nowrap px-6 py-4">{user.role}</td>
                                        <td className="whitespace-nowrap px-6 py-4">
                                        <button type="button" onClick={() => restoreUsers(user.id)} className="px-4 py-2 bg-orange-500 rounded-lg mr-2 font-bold text-white">
                                            Restore
                                        </button>
                                        <button type="button" onClick={() => deleteUsers(user.id)} className="px-4 py-2 bg-red-500 rounded-lg mr-2 font-bold text-white">
                                            Hapus Permanent
                                        </button>    
                                        </td>
                                    </tr>
                                ) )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
    </Case>
  );
}