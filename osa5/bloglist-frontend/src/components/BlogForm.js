import { useState } from 'react' 

const BlogForm = ({ createBlog, setErrorMessage }) => {
  const [title, setTitle] = useState('') 
  const [author, setAuthor] = useState('') 
  const [url, setUrl] = useState('') 
  

  const handleNewBlog = (event) => {
    event.preventDefault()

    createBlog({
      id: Math.random().toString(36).substring(2,10),
      title: title,
      author: author,
      url: url
      })
    
    setErrorMessage(`a new blog ${title} by ${author} added`)
    setTimeout(() => {
      setErrorMessage(null)
    }, 5000)

    setAuthor('')
    setTitle('')
    setUrl('')
  }

  return (
    <div>
       <h2>create new</h2>
        <form onSubmit={handleNewBlog}>
          <div>
            title:
              <input
              type="text"
              value={title}
              name="Title"
              onChange={({ target }) => setTitle(target.value)}
            />
          </div>
          <div>
            author:
              <input
              type="text"
              value={author}
              name="Author"
              onChange={({ target }) => setAuthor(target.value)}
            />
          </div>
          <div>
            url:
              <input
              type="text"
              value={url}
              name="Url"
              onChange={({ target }) => setUrl(target.value)}
            />
          </div>
          <button type="submit">create</button>
        </form>
    </div>
  )
}

export default BlogForm