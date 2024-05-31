import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Case from "../../components/case";
import Swal from'sweetalert2';


export default function User() {
    const [users, setUsers] = useState([])

    const navigate = useNavigate()

    const [error, setError] = useState([])

    const instance = axios.create({
        baseURL: 'http://localhost:8000/',
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('access_token')
        }
    })

    useEffect(() => {
        instance.get('users')
        .then( res => {
            setUsers(res.data.data)
            console.log(res.data.data)
        })
        .catch(err => {
            if (err.response.status == 401) {
                navigate('/login?message=' + encodeURIComponent('Anda Belum Login!'))
            }
        })
    }, [navigate])

    const deleteUser = (id) => {
        Swal.fire({
            title: 'Apakah kamu yakin?',
            text: "Item akan dihapus sementara, kamu dapat restore data ini di page trash!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Ya, hapus!',
            cancelButtonText: 'Batal'
        }).then((result) => {
            if (result.isConfirmed) {
                // Melakukan request delete
                instance.delete(`users/delete/${id}`)
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

    const viewUser = (user) => {
        Swal.fire({
            title: "Detail User",
            html: `
                <hr>
                <br>
                <div class="mb-4">
                    <strong>Username:</strong> ${user.username}
                </div>
                <div class="mb-4">
                    <strong>Email:</strong> ${user.email}
                </div>
                <div class="mb-4">
                    <strong>Role:</strong> ${user.role}
                </div>
            `,
            showCancelButton: false,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Tutup'
        });
    };


    return(
        <Case>
            <div className="block m-auto bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                <div className="items-center m-5 pb-10 pt-10">
                    <div className="flex justify-between">
                        <h5 className="mb-1 ml-5 text-3xl font-medium text-gray-900 dark:text-white">User</h5>
                        <div className="whitespace-nowrap">
                            <Link to="/users/create" className="px-4 py-2 mx-1 bg-teal-700 text-white shadow-md border-sky-500 rounded-lg">
                                Tambah
                                <FontAwesomeIcon icon="fa-solid fa-plus" className="pl-1 w-4 h-4 text-inherit" />
                            </Link>
                            <Link to="/users/trash" className="px-4 py-2 mx-1 bg-red-700 text-white shadow-md border-sky-500 rounded-lg">
                                Trash
                                <FontAwesomeIcon icon="fa-solid fa-trash" className="pl-1 w-4 h-4 text-inherit" />
                            </Link>
                        </div>
                    </div>
                    {
                        Object.keys(error).length > 0 ? (
                            <div role="alert">
                            <div className="bg-red-500 text-white font-bold rounded-t px-4 py-2">
                                Gagal!
                            </div>
                            <div className="border border-t-0 border-red-400 rounded-b bg-red-100 px-4 py-3 text-red-700">
                                <ul>
                                    <li>
                                        {
                                            error.message
                                        }
                                    </li>
                                </ul>
                            </div>
                            </div>
                        ) : ''
                    }
                    <div className="flex mt-4 md:mt-6">
                        <table className="min-w-full text-left text-sm font-light">
                            <thead className="border-b font-medium dark:border-neutral-500 text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                <tr className="text-center">
                                    <th scope="col" className="px-6 py-4">No</th>
                                    <th scope="col" className="px-6 py-4">Username</th>
                                    <th scope="col" className="px-6 py-4">Email</th>
                                    <th scope="col" className="px-6 py-4">Role</th>
                                    <th scope="col" className="px-6 py-4">Action</th>
                                </tr>
                            </thead>
                            <tbody className="text-black text-center">
                                {users.map((user, id) => (
                                    <tr key={user.id} className="border-b dark:border-neutral-500">
                                        <td className="whitespace-nowrap px-6 py-4">{id+1}</td>
                                        <td className="whitespace-nowrap px-6 py-4">{user.username}</td>
                                        <td className="whitespace-nowrap px-6 py-4">{user.email}</td>
                                        <td className="whitespace-nowrap px-6 py-4">{user.role}</td>
                                        <td className="whitespace-nowrap px-6 py-4">
                                            <button onClick={() => viewUser(user)} className="px-4 py-2 bg-purple-500 rounded-lg mr-2 font-bold text-white">Lihat</button>
                                            <Link to={'/users/edit/' + user.id} className="px-4 py-2 bg-orange-500 rounded-lg mr-2 font-bold text-white">Edit</Link>    
                                            <button type="button" onClick={() => deleteUser(user.id)} className="px-4 py-2 bg-red-500 rounded-lg mr-2 font-bold text-white">Hapus</button>    
                                        </td>
                                    </tr>
                                ) )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </Case>
    )
}