import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import List from './components/list/List'
import Chat from './components/chat/Chat'
import Detail from './components/detail/Detail'

function App() {

  return (
    <>
      <div className='container'>
        <List></List>
        <Chat></Chat>
        <Detail></Detail>
      </div>
    </>
  )
}

export default App
