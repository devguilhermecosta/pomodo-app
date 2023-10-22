interface ButtonProps {
  text: string;
  className?: string;
  onClick?: () => void;
}

export function Button(props: ButtonProps): JSX.Element {
  return(
    <button 
      className={props.className}
      onClick={props.onClick}>
      {props.text}
    </button>
  )
}