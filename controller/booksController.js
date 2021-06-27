let books = [
    {
        name: 'Mastering Kubernetes',
        author: 'hjwasim',
        year: 2020
    },
    {
        name: 'Docker in Deep',
        author: 'Nasim HJ',
        year: 2021
    },
    {
        name: 'MERN in Action',
        author: 'Mike Tyson',
        year: 2018
    }
]

const booksController = (req,res) => {
    res.json(books)
}


module.exports = booksController