const { ApolloServer } = require('apollo-server')
const { makeAugmentedSchema } = require('neo4j-graphql-js')
const fs = require('fs')
const { promisify } = require('util')
const glob = require('glob')


const asyncReadFile = promisify(fs.readFile)
const asyncGlob = promisify(glob)

class API {
  constructor(driver){
    this.driver = driver
  }

  async fetchSchema(schemaDirectory) {
    const targets = await asyncGlob(`${schemaDirectory}/*.graphql`)
    const files = targets.map(target => asyncReadFile(target))
    const definitions = await Promise.all(files)
    const typeDefs = definitions
      .map(definition => definitions.toString('utf-8'))
      .join('\n')

    return makeAugmentedSchema({ typeDefs })
  }

  async start(port = 8000) {
    const { driver } = this
    const schema = await this.fetchSchema('./schema')

    const server = new ApolloServer({
      context: { driver },
      schema
    })

    await server.listen(port)

    console.log(`API listening on port ${port}`)
  }
}

module.exports = API
