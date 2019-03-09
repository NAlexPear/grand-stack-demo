const { ApolloServer } = require('apollo-server')
const { makeAugmentedSchema } = require('neo4j-graphql-js')
const fs = require('fs')
const { promisify } = require('util')


const asyncReadFile = promisify(fs.readFile)

class API {
  constructor(driver){
    this.driver = driver
  }

  async fetchSchema(target) {
    const schema = await asyncReadFile(target)
    const typeDefs = schema.toString('utf-8')

    return makeAugmentedSchema({ typeDefs })
  }

  async start(port = 8000) {
    const { driver } = this
    const schema = await this.fetchSchema('./schema.graphql')

    const server = new ApolloServer({
      context: { driver },
      schema
    })

    await server.listen(port)

    console.log(`API listening on port ${port}`)
  }
}

module.exports = API
