const BlogInfo = ({ blog, like, user, remove }) => {
  if (blog.user.username === user.username) {
    return (
      <div>
        {blog.url}<br></br>
        likes: {blog.likes} <button onClick={like}>like</button><br></br>
        {blog.user.name}<br></br>
        <button onClick={remove}>remove</button>
      </div>
    )
  }
  else {
    return (
      <div>
        {blog.url}<br></br>
        likes: {blog.likes} <button onClick={like}>like</button><br></br>
        {blog.user.name}
      </div>
    )
  }
}

export default BlogInfo