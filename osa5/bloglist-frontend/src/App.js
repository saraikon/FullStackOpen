import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'


const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({
        username, password,
      })

      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      setErrorMessage('wrong username or password')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }  }

  const handleLogout = async (event) => {
    event.preventDefault()
    setUser(null)
    window.localStorage.clear()
    setErrorMessage('Logged out')
    setTimeout(() => {
      setErrorMessage(null)
    }, 5000)
  }

  const blogFormRef = useRef()

  const addBlog = (noteObject) => {
    blogFormRef.current.toggleVisibility()
    blogService
      .create(noteObject)
      .then(returnedBlog => {
        const newBlog = { ...returnedBlog, user: user }
        setBlogs(blogs.concat(newBlog))
      })
  }

  const likeBlog = id => {
    const blog = blogs.find(n => n.id === id)
    const newLikes = blog.likes + 1
    const changedBlog = { ...blog, likes: newLikes }

    blogService
      .update(id, changedBlog)
      .then(returnedBlog => {
        setBlogs(blogs.map(blog => blog.id !== id ? blog : { ...blog, likes: returnedBlog.likes }))
      })
      .catch(error => {
        setErrorMessage(
          `Blog '${blog.title}' was already removed from server`
        )
        console.log(error)
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
        setBlogs(blogs.filter(n => n.id !== id))
      })
  }

  const removeBlog = (blog) => {
    const id = blog.id
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author} `)) {
      blogService
        .remove(blog.id)
        .then(
          setBlogs(blogs.filter(b => b.id !== id))
        )
    }
  }

  if (user === null) {
    return (
      <div>
        <Notification message={errorMessage} />
        <h2>Log in to application</h2>
        <form onSubmit={handleLogin}>
          <div>
            username
            <input
              type="text"
              value={username}
              name="Username"
              onChange={({ target }) => setUsername(target.value)}
            />
          </div>
          <div>
            password
            <input
              type="password"
              value={password}
              name="Password"
              onChange={({ target }) => setPassword(target.value)}
            />
          </div>
          <button type="submit">login</button>
        </form>
      </div>
    )
  }

  return (
    <div>
      <h2>blogs</h2>
      <Notification message={errorMessage} />
      {user.name} is logged in <form onSubmit={handleLogout}><button type="submit">logout</button></form>
      <Togglable buttonLabel="create new blog" otherButtonLabel="cancel" ref={blogFormRef}>
        <BlogForm
          createBlog={addBlog}
          setErrorMessage={setErrorMessage}
        />
      </Togglable>
      {blogs
        .sort((a, b) => {return b.likes - a.likes})
        .map(blog =>
          <div key={blog.id}>
            <Blog blog={blog} like={() => likeBlog(blog.id)} user={user} remove={() => removeBlog(blog)} />
          </div>
        )}
    </div>
  )

}

export default App
