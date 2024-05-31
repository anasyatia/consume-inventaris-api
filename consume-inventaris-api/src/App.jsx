import { useState } from 'react'
import Title from "./components/title"
import Card from "./components/card"
import Case from "./components/case"

export default function App() {
  const [name, setName] = useState('PPLG') // state variable
  return (
    <Case>
    <div className='bg-gray-900 flex items-center justify-center min-h-screen'>
        <div className="bg-gray-800 border-t border-gray-600 shadow rounded-lg max-w-lg w-full p-6">
          <Title name="Dashboard" page="Home" lang="ReactJS" />
          <Card judul="Produktif" content="Content-card" ></Card>
            <h4 className='text-white text-2xl'>Hello {name}</h4>
            <p className='text-lg text-gray-400 leading-relaxed'>A JavaScript library for building user interfaces</p>
        </div>
    </div>
    </Case>
  )
}