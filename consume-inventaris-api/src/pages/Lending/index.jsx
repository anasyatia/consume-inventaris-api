import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Case from "../../components/case";
import Swal from "sweetalert2";


export default function Lending() {
    const [lendings, setLendings] = useState([])
    const [isLogin, setIsLogin] = useState(false);
    const [authUser, setAuthUser] = useState([]);

    const location = useLocation();

    const navigate = useNavigate()

    const [error, setError] = useState([])

    const instance = axios.create({
        baseURL: 'http://localhost:8000/',
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('access_token')
        }
    })

    useEffect(() => {
        instance.get('lendings')
        .then( res => {
            setLendings(res.data.data)
            console.log(res.data.data)
        })
        .catch(err => {
            if (err.response.status == 401) {
                navigate('/login?message=' + encodeURIComponent('Anda Belum Login!'))
            }
        })
    }, [navigate])

    instance.get('http://localhost:8000/profile')
            .then(res => {
                setIsLogin(true);
                setAuthUser(res.data.data);
            })
            .catch(err => {
                setIsLogin(false);
                if (err.response.status === 401) {
                    navigate('/login?message=' + encodeURIComponent('Anda Belum Login!'));
                }
            });

    const viewLending = (lending) => {
        const statusText = lending.status == 0 ? 'Belum Kembali' : 'Sudah Kembali';
    
        Swal.fire({
            title: "Detail Peminjaman",
            html: `
                <hr>
                <br>
                <div class="mb-4">
                    <strong>Nama peminjam:</strong> ${lending.name}
                </div>
                <div class="mb-4">
                    <strong>Nama barang:</strong> ${lending.stuff.name}
                </div>
                <div class="mb-4">
                    <strong>Total barang yang dipinjam:</strong> ${lending.total_stuff}
                </div>
                <div class="mb-4">
                    <strong>Tanggal dipinjam:</strong> ${lending.date_time}
                </div>
                <div class="mb-4">
                    <strong>Tanggal dikembalikan:</strong> ${lending.restoration ? lending.restoration.date_time : 'Barang belum dikembalikan!'}
                </div>
                <div class="mb-4">
                    <strong>Notes:</strong> ${lending.notes}
                </div>
                <div class="mb-4">
                    <strong>Keterangan:</strong> ${statusText}
                </div>
            `,
            showCancelButton: false,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Tutup'
        });
    };

    const deleteLending = (id) => {
        Swal.fire({
            title: 'Apakah kamu yakin?',
            text: "Item akan dihapus sementara, kamu dapat restore stuff ini di page trash!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Ya, hapus!',
            cancelButtonText: 'Batal'
        }).then((result) => {
            if (result.isConfirmed) {
                // Melakukan request delete
                instance.delete(`lendings/delete/${id}`)
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
    

    return(
        <Case>
            <div className="block m-auto bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                <div className="items-center m-5 pb-10 pt-10">
                    <div className="flex justify-between">
                        <h5 className="mb-1 ml-5 text-3xl font-medium text-gray-900 dark:text-white">Lending</h5>
                        
                            <Link to={"/lending/create"} className="px-4 py-2 mx-1 bg-teal-700 text-white shadow-md border-sky-500 rounded-lg">
                                Tambah
                                <FontAwesomeIcon icon="fa-solid fa-plus" className="pl-1 w-4 h-4 text-inherit" />
                            </Link>
                        
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
                            <thead className="border-b font-medium dark:border-neutral-500 text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 text-center">
                                <tr>
                                    <th scope="col" className="px-6 py-4">No</th>
                                    <th scope="col" className="px-6 py-4">Nama</th>
                                    <th scope="col" className="px-6 py-4">Barang</th>
                                    <th scope="col" className="px-6 py-4">Tanggal</th>
                                    <th scope="col" className="px-6 py-4">Notes</th>
                                    <th scope="col" className="px-6 py-4">Keterangan</th>
                                    <th scope="col" className="px-6 py-4">Action</th>
                                </tr>
                            </thead>
                            <tbody className="text-dark text-center">
                                {lendings.map((lending, id) => (
                                    <tr key={lending.id} className="border-b dark:border-neutral-500">
                                        <td className="whitespace-nowrap px-6 py-4">{id+1}</td>
                                        <td className="whitespace-nowrap px-6 py-4">{lending.name}</td>
                                        <td className="whitespace-nowrap px-6 py-4">
                                            {lending.stuff.name} <br/>
                                            Total pinjam : {lending.total_stuff}
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4">{lending.date_time}</td>
                                        <td className="whitespace-nowrap px-6 py-4">{lending.notes}</td>
                                        <td className="whitespace-nowrap px-6 py-4">
                                            {lending.status == 0 ? (
                                                <span className="text-red-700">Belum Kembali</span>
                                            ) : (
                                                <span className="text-green-500">Sudah Kembali</span>
                                            )}
                                        </td>
                                        <td className="text-center">
                                        {isLogin ? (
                                            authUser['role'] === 'admin' ? (
                                                <div className="whitespace-nowrap px-6 py-4 justify-center flex">
                                                    <button onClick={() => viewLending(lending)} className="px-4 py-2 bg-purple-500 rounded-lg mr-2 font-bold text-white">
                                                        Lihat
                                                    </button>
                                                </div>
                                            ) : authUser['role'] === 'staff' ? (
                                                lending.status == 0 ? (
                                                    <div className="whitespace-nowrap px-6 py-4 justify-center flex">
                                                        <button onClick={() => viewLending(lending)} className="px-4 py-2 bg-purple-500 rounded-lg mr-2 font-bold text-white">
                                                            Lihat
                                                        </button>
                                                        <button onClick={() => deleteLending(lending.id)} className="px-4 py-2 bg-gray-500 rounded-lg mr-2 font-bold text-white">
                                                            Batal
                                                        </button>
                                                        <Link to={'/lending/restoration/' + lending.id} type="button" className="px-4 py-2 bg-green-500 rounded-lg font-bold text-white">
                                                            Kembali
                                                        </Link>
                                                    </div>
                                                ) : (
                                                    <div className="whitespace-nowrap px-6 py-4 justify-center flex">
                                                        <button onClick={() => viewLending(lending)} className="px-4 py-2 bg-purple-500 rounded-lg mr-2 font-bold text-white">
                                                            Lihat
                                                        </button>
                                                    </div>
                                                )
                                            ) : null
                                        ) : null}
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