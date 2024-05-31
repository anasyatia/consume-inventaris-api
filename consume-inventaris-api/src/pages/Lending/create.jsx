import axios from "axios"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import Case from "../../components/case"

export default function LendingCreate() {
    const [stuffs, setStuffs] = useState([])
    const [forms, setForms] = useState({
        stuff_id: '',
        date: '',
        name: '',
        user_id: '',
        notes: '',
        total_stuff: ''
    })

    const [error, setError] = useState([])

    const navigate = useNavigate()

    const instance = axios.create({
        baseURL: 'http://localhost:8000/',
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('access_token')
        }
    })

    useEffect(() => {
        instance.get('stuffs', {
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('access_token')
                }
            })
            .then(res => {
                setStuffs(res.data.data)
            })
            .catch(err => {
                console.log(err.response.status)
                if (err.response.status == 401) {
                    navigate('/login?message=' + encodeURIComponent('Anda Belum Login!'))
                }
            })
    }, [navigate])

    const handleCreateLending = (event) => {
        event.preventDefault();

        instance.post('lendings/store', forms)
        .then(res => {
            navigate('/lending');
        }) 
        .catch(err => {
            console.log(err)
            setError(err.response.data)
        })
    }

    return (
        <Case>
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
                    <div className="flex justify-center">
                        <h5 className="mb-1 ml-5 text-3xl font-medium text-gray-900 dark:text-white">Lending</h5>
                    </div>
                    <form onSubmit={handleCreateLending} class="max-w-sm mx-auto">
                        <div class="mb-5">
                            <label for="stuff_id" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Kategori Barang</label>
                            <select id="stuff_id" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-teal-500 focus:border-teal-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-teal-500 dark:focus:border-teal-500" onChange={e => setForms({...forms, stuff_id: e.target.value})}>
                                <option selected>Pilih Barang</option>
                                {
                                    stuffs.map((stuff) => (
                                        <option value={stuff.id}>{stuff.name}</option>
                                    ))
                                }
                            </select>
                        </div>
                        <div class="mb-5">
                            <label for="name" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Nama Peminjam</label>
                            <input type="text" id="name" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-teal-500 focus:border-teal-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-teal-500 dark:focus:border-teal-500" placeholder="Ketik Nama Peminjam" onChange={e => setForms({...forms, name: e.target.value})} />
                        </div>
                        <div class="mb-5">
                            <label for="total_stuff" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Total Barang</label>
                            <input type="number" id="total_stuff" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                            placeholder="Ketik Total Pinjam" required  onChange={e => setForms({...forms, total_stuff: e.target.value})} />
                        </div>
                        <div class="mb-5">
                            <label for="date_time" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Waktu Pinjam</label>
                            <input type="datetime-local" id="date_time" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                            placeholder="#" required  onChange={e => setForms({...forms, date_time: e.target.value})} />
                        </div>
                        <div class="mb-5">
                            <label for="notes" class="block text-sm font-medium leading-6 text-gray-900 dark:text-white">Notes</label>
                            <textarea type="notes" id="notes" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                            placeholder="Ketik Notes" required  onChange={e => setForms({...forms, notes: e.target.value})}></textarea>
                        </div>
                        <div className="flex justify-end">
                            <button type="submit" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Submit</button>
                        </div>
                    </form>
                </div>
            </div>
        </Case>
    )
}