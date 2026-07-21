import { useState } from 'react'

import './App.css'

import AddClub from './components/AddClub'
import OwnerClubs from './components/OwnerClubs'

function App() {

  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
    <button onClick={() => setIsModalOpen(true)}>Add New Club</button>

    <AddClub 
      isOpen={isModalOpen} 
      onClose={() => setIsModalOpen(false)} 
      onSuccess={() => fetchClubsList()} 
    />
  </>
  )
}

export default App
