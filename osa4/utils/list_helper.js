const lodash = require('lodash')

const dummy = (blogs) => {
    return 1
  }

const totalLikes = (blogs) => {
    const reducer = blogs.reduce((prev, curr) => {
        return prev + curr.likes
    }, 0)

    return reducer
}

const favoriteBlog = (blogs) => {
    const reducer = blogs.reduce((prev, curr) => {
        return (prev.likes > curr.likes) ? prev : curr
    })

    return { 
        title: reducer.title,
        author: reducer.author,
        likes: reducer.likes
    }
}

const mostBlogs = (blogs) => {
    const authors = blogs.map(blog => blog.author)
    const result =
        lodash.head(lodash(authors)
        .countBy()
        .entries()
        .maxBy(lodash.last))

    const count = {}
    authors.forEach(e => count[e] ? count[e]++ : count[e] = 1 )
    const arr = Object.values(count)
    const max = Math.max(...arr)

    return {
        author: result,
        blogs: max
    }
}

const mostLikes = (blogs) => {
    const list = blogs.map(({author, likes}) => {
        return {author, likes}
    })

    const result = list.reduce((acc, val) => {
        const findAuth = acc.find(auth => auth.author === val.author);
    
        if (findAuth) {
            findAuth.likes += val.likes;
        } else {
            acc.push(val);
        }
    
        return acc;
    }, []);

    const reducer = result.reduce((prev, curr) => {
        return (prev.likes > curr.likes) ? prev : curr
    })

    return reducer
}

module.exports = {
  dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes
}