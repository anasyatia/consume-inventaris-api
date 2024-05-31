import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Case from "../../components/case";
import Swal from "sweetalert2";

export default function LendingReturn({data, onClose}) {
    const [lendings, setLendings] = useState([])
    const [forms, setForms] = useState({
        date_time: '',
        total_good_stuff: '',
        total_defec_stuff: ''
    })

    const params = useParams();
    const navigate = useNavigate()
    const id = params.id

    const [error, setError] = useState([]);

    const instance = axios.create({
        baseURL: 'http://localhost:8000/',
        headers: {
            'Authorization': 'Bearer '+ localStorage.getItem('access_token'),
        }
    })

    useEffect(() => {
        instance.get(`lendings/${id}`)
            .then(res => {
                setLendings(res.data.data)
                console.log(res.data.data)
            })
            .catch(err => {
                console.log(err.response)
            })
    }, [])

    const handleReturnLend = (event) => {
        event.preventDefault();

        instance.post(`restorations/${id}`, forms)
           .then(res => {
                Swal.fire({
                    icon:'success',
                    title: 'Berhasil mengembalikan barang!',
                    showConfirmButton: false,
                    timer: 2500
                })
                navigate('/lending');
            })
           .catch(err => {
                setError(err.response.data.data)
                console.log(err.response)
            })
    }

    return (
        <div className="block m-auto h-screen bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
        <div className="items-center m-5 pb-10 pt-10">
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

            {lendings ? (
                <table className="max-w-sm mx-auto">
                    <tr>
                        <td className="font-bold">Detail Barang</td>
                    </tr>
                    <tr>
                        <td>Barang</td>
                        <td>:</td>
                        <td>{ lendings.stuff ? lendings.stuff.name : '-' }</td>
                    </tr>
                    <tr>
                        <td>Tanggal</td>
                        <td>:</td>
                        <td>{ lendings.date_time }</td>
                    </tr>
                    <tr>
                        <td>Total barang yang ingin dipinjam</td>
                        <td>:</td>
                        <td>{ lendings.total_stuff }</td>
                    </tr>
                </table>
            ) : ''}      
                    <form onSubmit={handleReturnLend} class="max-w-sm mx-auto">
                    <br />
                    <hr />
                    <br />
                        <div class="mb-5">  
                            <label for="date_time" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Tanggal kembali</label>
                            <input type="datetime-local" id="date_time" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Ketik Tanggal Kembali" required  onChange={e => setForms({...forms, date_time: e.target.value})} />
                        </div>
                        <div class="mb-5">
                            <label for="total_good_stuff" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Total barang bagus</label>
                            <input type="number" id="total_good_stuff" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Ketik barang bagus" required  onChange={e => setForms({...forms, total_good_stuff: e.target.value})} />
                        </div>
                        <div class="mb-5">
                            <label for="total_defec_stuff" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Total barang cacat</label>
                            <input type="number" id="total_defec_stuff" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Ketik barang cacat" required  onChange={e => setForms({...forms, total_defec_stuff: e.target.value})} />
                        </div>
                        <div className="flex justify-end">
                            <button type="submit" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Submit</button>
                        </div>
                    </form>
                </div>
        </div>
    )
}