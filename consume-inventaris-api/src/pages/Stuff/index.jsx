import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Case from "../../components/case";
import Swal from 'sweetalert2';


export default function Stuff() {
    const [stuffs, setStuffs] = useState([]);
    const [error, setError] = useState([]);
    const navigate = useNavigate();

    const instance = axios.create({
        baseURL: 'http://localhost:8000/',
        headers: {
            'Authorization': 'Bearer '+ localStorage.getItem('access_token'),
        }
    })

    useEffect(() => {
        instance.get('stuffs')
        .then(res => {
            setStuffs(res.data.data);
            console.log(res.data.data);
        })
        .catch(err => {
            if(err.response.status === 401) {
                navigate('/login?massage=' + encodeURIComponent('Anda belum login!'));
            }
        })
    }, [navigate])

    const deleteStuff = (id) => {
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
                instance.delete(`stuffs/delete/${id}`)
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
                            text: 'Stock sudah terisi, tidak bisa menghapus!',
                            footer: '<a href="#">Hubungi admin jika masalah persist.</a>'
                        });
                    });
            }
        });
    };

    const viewStuff = (stuff) => {
        console.log(stuff)
        Swal.fire({
            title: "Detail Stuff",
            html: `
                <hr>
                <br>
                <div class="mb-4">
                    <strong>Nama barang:</strong> ${stuff.name}
                </div>
                <div class="mb-4">
                    <strong>Kategori:</strong> ${stuff.category}
                </div>
                <div class="mb-4">
                    <strong>Stok:</strong> ${stuff.stuff_stock ? stuff.stuff_stock.total_available : 'Stok belum ditambahkan'}
                </div>
                <div class="mb-4">
                    <strong>Jumlah barang yang dipinjam:</strong> ${stuff.lendings.length}
                </div>
            `,
            showCancelButton: false,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Tutup'
        });
    };

    return (
        <Case>
            <div className="block m-auto bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                <div className="items-center m-5 pb-10 pt-10">
                    <div className="flex justify-between">
                        <h5 className="mb-1 ml-5 text-3xl font-medium text-gray-900 dark:text-white">Stuff</h5>
                        <div className="whitespace-nowrap">
                            <Link to="/stuff/create" className="px-4 py-2 mx-1 bg-teal-700 text-white shadow-md border-sky-500 rounded-lg">
                                Tambah
                                <FontAwesomeIcon icon="fa-solid fa-plus" className="pl-1 w-4 h-4 text-inherit" />
                            </Link>
                            <Link to="/stuff/trash" className="px-4 py-2 mx-1 bg-red-700 text-white shadow-md border-sky-500 rounded-lg">
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
                                        {
                                            Object.entries(error).map(([key, value], i) => (
                                                <li key={key}>{key != "status" ? i+1 + '. ' + value : ''}</li>
                                            ))
                                        }
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
                                    <th scope="col" className="px-6 py-4">Name</th>
                                    <th scope="col" className="px-6 py-4">Category</th>
                                    <th scope="col" className="px-6 py-4">Stok</th>
                                    <th scope="col" className="px-6 py-4">Action</th>
                                </tr>
                            </thead>
                            <tbody className="text-center">
                                    {stuffs.map((stuff, id) => (
                                        <tr key={stuff.id} className="border-b dark:border-neutral-500">
                                            <td className="whitespace-nowrap px-6 px-4">{id+1}</td>
                                            <td className="whitespace-nowrap px-6 px-4">{stuff.name}</td>
                                            <td className="whitespace-nowrap px-6 px-4">{stuff.category}</td>
                                            {
                                                stuff.stuff_stock ? (
                                                    <td className="whitespace-nowrap px-6 px-4">
                                                        Total Available: {stuff.stuff_stock.total_available} <br />
                                                    </td>
                                                ) : (
                                                     <td className="whitespace-nowrap px-6 px-4">
                                                        Stock belum ditambahkan <br />
                                                    </td>
                                                )
                                            }
                                            <td className="whitespace-nowrap px-6 py-4">
                                                <button onClick={() => viewStuff(stuff)} className="px-4 py-2 bg-purple-500 rounded-lg mr-2 font-bold text-white">Lihat</button>
                                                <Link to={'/stuff/edit/' + stuff.id} className="px-4 py-2 bg-blue-500 rounded-lg mr-2 font-bold text-white">Edit</Link>
                                                <button type="button" onClick={() => deleteStuff(stuff.id)} className="px-4 py-2 bg-red-500 rounded-lg mr-2 font-bold text-white">Hapus</button>
                                            </td>
                                        </tr>
                                    ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </Case>
    );
}
