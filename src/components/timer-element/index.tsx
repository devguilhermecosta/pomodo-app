import { secondsToMinute } from '../../utils/seconds-to-minute';

interface TimerProps {
  pomodoroTime: number;
}

export function TimerElement(props: TimerProps): JSX.Element {
  return(
    <div className="timer">
      {secondsToMinute(props.pomodoroTime)}
    </div>
  );
}