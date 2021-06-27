const PASSWORD = process.env.DB_PASSWORD
const USERNAME = process.env.DB_USERNAME


module.exports = {uri: `mongodb+srv://${USERNAME}:${PASSWORD}@ams-cluster.i3cio.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`}
