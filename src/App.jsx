import { useState } from 'react'
import './App.css'
import Design from './components/Design'
import Options from './components/Options'
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "./components/ui/resizable"
function App() {

  const [designAttributes, setDesignAttributes] = useState({
    eyes: true,
    nose: true,
    ear: true,
    mouth: true,
  })

  return (
    <ResizablePanelGroup direction="horizontal" className='p-6 pt-14 transition-none'>
      <ResizablePanel defaultSize={75} className='transition-none min-w-[500px]'>
        <Design designAttributes={designAttributes} />
      </ResizablePanel>
      <ResizableHandle withHandle className='transition-none px-1 rounded-md bg-light/5'/>
      <ResizablePanel defaultSize={25} className='transition-none min-w-[250px]'>
        <Options designAttributes={designAttributes} setDesignAttributes={setDesignAttributes} />
      </ResizablePanel>
    </ResizablePanelGroup>
  )
}

export default App
