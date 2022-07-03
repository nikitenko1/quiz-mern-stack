const Role = ({currentRole, Icon, text, cb}) => {
  return (
    <div className='role' onClick={() => cb(text)}>
      <div className={`roleIcon ${currentRole === text ? 'active' : undefined}`}>
        <Icon />
      </div>
      <p className={currentRole === text ? 'active' : undefined}>{text}</p>
    </div>
  )
}

export default Role