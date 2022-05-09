const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

const api = supertest(app)

const Blog = require('../models/blog')
const User = require('../models/user')

beforeEach(async () => {
    await Blog.deleteMany({})
    await Blog.insertMany(helper.listWithManyBlogs)

    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username: 'root', passwordHash })

    await user.save()
  })

test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('all blogs are returned', async () => {
    const response = await api.get('/api/blogs')
    
    expect(response.body).toHaveLength(helper.listWithManyBlogs.length)
  })

test('blogs are identified by id', async () => {
    const response = await api.get('/api/blogs')
    const content = response.body
    
    content.forEach(cont => expect(cont.id).toBeDefined())
  })

test('a valid blog can be added ', async () => {
  const newBlog = {
    id: "1827408174087210",
    title: "New Blog",
    author: "Some Author",
    url: "https://someurl.com/",
    likes: 2
  }
  
  const user = {
    username: 'root',
    password: 'sekret'
  }

  const resp = await api
    .post('/api/login')
    .send(user)

  await api
    .post('/api/blogs')
    .send(newBlog)
    .set({ Authorization: `bearer ${resp.body.token}` })
    .expect(201)
    .expect('Content-Type', /application\/json/)
  
  const blogsAtEnd = await helper.blogsInDb()
  expect(blogsAtEnd).toHaveLength(helper.listWithManyBlogs.length + 1)
  
  const contents = blogsAtEnd.map(b => b.title)
  expect(contents).toContain(
    'New Blog'
  )
})

test('unauthorized users cannot post in blog', async () => {
  const newBlog = {
    id: "1827408174087210",
    title: "New Blog",
    author: "Some Author",
    url: "https://someurl.com/",
    likes: 2
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(401)
})


test('likes default to 0', async () => {
  const newBlog = {
    id: "38749384981398",
    title: "New Blog 2",
    author: "Some Author 2",
    url: "https://someurl2.com/"
  }

  const user = {
    username: 'root',
    password: 'sekret'
  }

  const resp = await api
    .post('/api/login')
    .send(user)
    
  await api
    .post('/api/blogs')
    .send(newBlog)  
    .set({ Authorization: `bearer ${resp.body.token}` })  
    
  const blogsAtEnd = await helper.blogsInDb()
  expect(blogsAtEnd[helper.listWithManyBlogs.length].likes).toBe(0)
})
  
test('blog needs title or url', async () => {
  const newBlog = {
    id: "38749384981398",
    author: "Some Author 2"
  }

  const newBlog2 = {
    id: "38782174029",
    title: "test",
    author: "Some Author 2"
  }

  const newBlog3 = {
    id: "8059402984",
    author: "Some Author 2",
    url: "someurl"
  }

  const user = {
    username: 'root',
    password: 'sekret'
  }

  const resp = await api
    .post('/api/login')
    .send(user)

  await api
    .post('/api/blogs')
    .send(newBlog)
    .set({ Authorization: `bearer ${resp.body.token}` })
    .expect(400)
  
  await api
    .post('/api/blogs')
    .send(newBlog2)
    .set({ Authorization: `bearer ${resp.body.token}` })
    .expect(201)

  await api
    .post('/api/blogs')
    .send(newBlog3)
    .set({ Authorization: `bearer ${resp.body.token}` })
    .expect(201)

})


test('delete succeeds with status code 204 if id is valid', async () => {
  const newBlog2 = {
    id: "38782174029",
    title: "test",
    author: "Some Author 2"
  }
  
  const user = {
    username: 'root',
    password: 'sekret'
  }

  const resp = await api
    .post('/api/login')
    .send(user)

  await api
    .post('/api/blogs')
    .send(newBlog2)
    .set({ Authorization: `bearer ${resp.body.token}` })

  await api
    .delete(`/api/blogs/${newBlog2.id}`)
    .set({ Authorization: `bearer ${resp.body.token}` })
    .expect(204)

  const blogsAtEnd = await helper.blogsInDb()

  const contents = blogsAtEnd.map(t => t.title)

  expect(contents).not.toContain(newBlog2.title)
})

test('updating succeeds', async () => {
  const blogsAtStart = await helper.blogsInDb()
  const blogToUpdate = blogsAtStart[0]

  const blogUpdate = {
    title: "New Blog 2",
    author: "Some Author 2",
    url: "https://someurl2.com/",
    likes: 100
  }

  await api
    .put(`/api/blogs/${blogToUpdate.id}`)
    .send(blogUpdate)
  
  const blogsAtEnd = await helper.blogsInDb()
  const updatedBlog = blogsAtEnd[0]

  expect(updatedBlog.title).toBe("New Blog 2")
  expect(updatedBlog.id).toBe(blogToUpdate.id)
  expect(updatedBlog.author).toBe("Some Author 2")
  expect(updatedBlog.url).toBe("https://someurl2.com/")
  expect(updatedBlog.likes).toBe(100)

})



afterAll(() => {
    mongoose.connection.close()
  })