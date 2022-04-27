import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useParams} from 'react-router-dom'
import { deleteBlog } from '../../redux/actions/blogAction'

import { IBlog, IParams, IUser, RootStore } from '../../utils/TypeScript'

interface IProps {
  blog: IBlog
}

const CardVert: React.FC<IProps> = ({blog}) => {
  const { auth } = useSelector((state: RootStore) => state)
  const { slug } = useParams<IParams>()
  const dispatch = useDispatch()
  const user = blog.user as IUser
  console.log(auth.user);


  const handleDelete = () => {
    if(!auth.user || !auth.access_token) return;

    if(slug !== auth.user._id && auth.user.role !=='admin') return dispatch({
      type: 'ALERT',
      payload: { errors: 'Invalid Authentication.' }
    })

    if(window.confirm("Do you want to delete this post?")){
      dispatch(deleteBlog(blog, auth.access_token))
    }
  }
  return (
    <div className="card border border-secondary border-2 mb-5" >
      {
        typeof(blog.thumbnail) === 'string' &&
        <img src={blog.thumbnail} className="card-img-top p-2" alt="..."
        style={{height: '180px', objectFit: 'cover', borderRadius:'11px'}} />
      }

      <div className="card-body">
        <h5 className="card-title ">
          <Link to={`/blog/${blog._id}`} style={{
            textDecoration: 'none', textTransform: 'capitalize'
          }}>
            {(blog.title.length>50)?(blog.title.slice(0,50) + '...'):(blog.title)}
          </Link>
        </h5>
        <p className="card-text">
          { (blog.description.length>100)?(blog.description.slice(0,100) + '...'):(blog.description) }
        </p>
      </div>
      <div className="d-flex justify-content-center">
      {
        (user._id === auth.user?._id || auth.user?.role ==='admin') &&
          <div style={{cursor: 'pointer'}}>
            <Link to={`/update_blog/${blog._id}`}>
              <i className="fas fa-edit" title="edit" />
            </Link>

            <i className="fas fa-trash text-danger mx-3" 
              title="edit" onClick={handleDelete} />
            </div>
      } 
      </div>
      <div className="m-3">
        <p className="card-text d-flex justify-content-between">
          <small className="text-muted text-capitalize fw-bold">
            {
              typeof(blog.user) !== 'string' &&
              <Link to={`/profile/${blog.user._id}`} style={{
                textDecoration: 'none', textTransform: 'capitalize'
              }}>
                By: {blog.user.name}
              </Link>
            }
          </small>

          <small className="text-muted fw-bold">
            { new Date(blog.createdAt).toLocaleString().split(',')[0] }
          </small>
        </p>
      </div>
    </div>
  )
}

export default CardVert
