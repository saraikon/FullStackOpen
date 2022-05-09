import BlogInfo from './BlogInfo'
import Togglable from './Togglable'

const Blog = ({blog, like, user, remove }) => {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  return (
    <div style={blogStyle}>
      <div> 
        {blog.title} {blog.author}
      </div>
      <Togglable buttonLabel="view" otherButtonLabel="hide">
        <BlogInfo blog={blog} like={like} user={user} remove={remove} />
      </Togglable>
  </div>
)}

export default Blog