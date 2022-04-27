import React, { useEffect, useState } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import { useDispatch } from 'react-redux'

import { IParams, FormSubmit } from '../../utils/TypeScript'

import { resetPassword } from '../../redux/actions/userAction'

const ResetPassword = () => {
  const token = useParams<IParams>().slug
  const dispatch = useDispatch()

  const [password, setPassword] = useState('')
  const [cf_password, setCfPassword] = useState('')
  const [typePass, setTypePass] = useState(false)
  const [typeCfPass, setTypeCfPass] = useState(false)
  const [done,setDone] = useState(false)

  const history = useHistory()

  useEffect(() => {
    if(done) {
      history.push('/login')
    }
  },[done, history])

  const handleSubmit = (e: FormSubmit) => {
    e.preventDefault()
    dispatch(resetPassword(password, cf_password, token))
    setDone(true)
  }

  return (
    <div className="auth_page">
      <form className="auth_box" onSubmit={handleSubmit}>
        <h3 className="text-uppercase text-center mb-4"> 
          Reset Password
        </h3>

        <div className="form-group my-2">
          <label htmlFor="password" className="form-label">Password</label>
          <div className="pass">
            <input type={typePass ? "text" : "password"} 
            className="form-control" 
            id="password"
            name="password" value={password} 
            onChange={e => setPassword(e.target.value)} 
            />
          <small onClick={() => setTypePass(!typePass)} className="mx-1">
            {typePass ? (<i className="fs-6 bi bi-eye-slash-fill"/>) : (<i className="bi bi-eye-fill fs-6"/>)}
          </small>
          </div>
        </div>

        <div className="form-group my-2">
          <label htmlFor="password" className="form-label">Confirm Password</label>
          <div className="pass">
            <input type={typeCfPass ? "text" : "password"} 
            className="form-control" 
            id="password"
            name="password" value={cf_password} 
            onChange={e => setCfPassword(e.target.value)} 
            />
          <small onClick={() => setTypeCfPass(!typeCfPass)} className="mx-1">
            {typeCfPass ? (<i className="fs-6 bi bi-eye-slash-fill"/>) : (<i className="bi bi-eye-fill fs-6"/>)}
          </small>
          </div>
        </div>

        <button type="submit" className="btn btn-dark w-100 mt-2">
          Reset Password
        </button>
     </form>
    </div>
  )
}

export default ResetPassword