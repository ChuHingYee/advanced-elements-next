interface Props {
  text: string
  onAdvClick?: () => void
}

const Readonly = (props: Props) => {
  const handleClick = () => {
    props.onAdvClick && props.onAdvClick()
  }
  return (
    <div class="adv-field-readonly" onClick={handleClick}>
      {props.text}
    </div>
  )
}

export default Readonly
