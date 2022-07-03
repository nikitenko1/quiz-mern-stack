import { useSelector } from 'react-redux'
import { AiOutlineClose } from 'react-icons/ai'
import { GiTeacher } from 'react-icons/gi'
import { FaUserGraduate } from 'react-icons/fa'
import Loader from './../global/Loader'
import Role from './Role';

const RoleModal = ({cb, currentRole, onChooseRole, setOnChooseRole, handleSubmit}) => {
  const { alert } = useSelector(state => state)

  return (
    <div className={`roleModal ${onChooseRole ? 'active' : undefined}`}>
      <div className={`roleModal__box ${onChooseRole ? 'active' : undefined}`}>
        <div className='roleModal__header'>
          <h3>Choose Your Role</h3>
          <AiOutlineClose onClick={() => setOnChooseRole(false)} />
        </div>
        <div className='roleModal__body'>
          <div className='roleModal__choice'>
            <Role
              currentRole={currentRole}
              Icon={FaUserGraduate}
              text='Student'
              cb={cb}
            />
            <Role
              currentRole={currentRole}
              Icon={GiTeacher}
              text='Instructor'
              cb={cb}
            />
          </div>
          <button type='submit' onClick={handleSubmit} disabled={alert.loading ? true : false}>
            {
              alert.loading 
              ? (
                <div className='center'>
                  <Loader width='20px' height='20px' border='2px' />
                </div>
              )
              : 'Sign Up'
            }
          </button>
        </div>
      </div>
    </div>
  )
}

export default RoleModal