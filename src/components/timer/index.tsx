import { useState, useEffect, useCallback } from 'react';
import { useInterval } from '../../hooks/use-interval';
import { TimerElement } from '../timer-element';
import { Button } from '../button';
import mp3Start from '../../sounds/bell-start.mp3';
import SoundFinish from '../../sounds/bell-finish.mp3';
import { secondsToHoure } from '../../utils/seconds-to-hour';

interface TimerProps {
  defaultPomodoroTimer: number;
  shortRestTime: number;
  longRestTime: number;
  cycles: number;
}

const soundStart = new Audio(mp3Start);
const soundFinish = new Audio(SoundFinish);

export function PomodoroTimer(props: TimerProps): JSX.Element {  
  const [ mainTime, setMainTime ] = useState(props.defaultPomodoroTimer);
  const [ timeCounting, setTimeCounting ] = useState(false);
  const [ working, setWorking ] = useState(false);
  const [ resting, setResting ] = useState(false);
  const [ cyclesQteManager, setCyclesQteManager ] = useState(props.cycles - 1);

  const [ completedCycles, setCompleteCycles ] = useState(0);
  const [ fullWorkingTime, setFullWorkingTime ] = useState(0);
  const [ numberOfPomodoros, setNumberOfPomodoros ] = useState(0);

  const body = document.body;

  useInterval(() => {
    setMainTime(mainTime - 1);
    if (working) {
      setFullWorkingTime(fullWorkingTime + 1);
    }
  }, 
  timeCounting ? 1000 : null);

  const configureWork = useCallback(() => {
    setTimeCounting(true);
    setWorking(true),
    setResting(false);
    setMainTime(props.defaultPomodoroTimer);
    soundStart.play();
  }, [ props.defaultPomodoroTimer ])

  const configureRest = useCallback((long: boolean) => {
    setTimeCounting(true);
    setWorking(false);
    setResting(true);

    if (long) {
      setMainTime(props.longRestTime);
    } else {
      setMainTime(props.shortRestTime);
    }

    soundFinish.play();
  }, 
  [
    props.longRestTime,
    props.shortRestTime,
  ])

  function pause() {
    setTimeCounting(false);
    setWorking(false);
    setMainTime(mainTime);
  }

  function reset() {
    setWorking(false);
    setTimeCounting(false);
    setResting(false);
    setMainTime(props.defaultPomodoroTimer);
  }

  useEffect(() => {
    timeCounting ? body.classList.add('working') : body.classList.remove('working');

    if (mainTime > 0) return;

    if (working && cyclesQteManager > 0) {
      configureRest(false);
      setCyclesQteManager(cyclesQteManager - 1);
    } else if (working && cyclesQteManager <= 0) {
      configureRest(true);
      setCyclesQteManager(props.cycles - 1);
      setCompleteCycles(completedCycles + 1);
    }

    if (working) setNumberOfPomodoros(numberOfPomodoros + 1);
    if (resting) configureWork();
  }, 
  [
    body,
    timeCounting,
    mainTime,
    working,
    cyclesQteManager,
    completedCycles,
    configureRest,
    configureWork,
    numberOfPomodoros,
    resting,
    props.cycles,
  ]);

  return(
    <div className="pomodoro">
      <h2>Você está: {working ? 'Trabalhando' : 'descansando'}</h2>
      <TimerElement
        pomodoroTime={mainTime}
      />
      <div className="controls">
        {!working && (
          <Button
            text='work'
            className='button'
            onClick={configureWork} 
          />
        )}

        {working && (
          <Button
          text='pause'
          className='button'
          onClick={pause} 
        />
        )}

        <Button 
          text='rest' 
          className='button'
          onClick={() => configureRest(true)}
        />
        <Button 
          text='reset' 
          className='button'
          onClick={reset} 
        />

      </div>
      <div className='data'>
        <p>ciclos concluídos: {completedCycles}</p>
        <p>horas trabalhadas: {secondsToHoure(fullWorkingTime)}</p>
        <p>pomodoros concluídos: {numberOfPomodoros}</p>
      </div>
    </div>
  );
}
