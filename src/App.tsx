import { PomodoroTimer } from './components/timer';


function App() {

  return (
    <>
      <PomodoroTimer 
        defaultPomodoroTimer={1500}
        shortRestTime={300}
        longRestTime={600}
        cycles={4}
      />
    </>
  )
}

export default App
