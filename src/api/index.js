const { ApolloServer } = require('apollo-server')
const { v1: neo4j } = require('neo4j-driver')
const { makeAugmentedSchema } = require('neo4j-graphql-js')


const typeDefs = `
  type User {
    id: ID!
      name: String
      friends: [User] @relation(name: "FRIENDS", direction: "BOTH")
      reviews: [Review] @relation(name: "WROTE", direction: "OUT")
      avgStars: Float
        @cypher(
                statement: "MATCH (this)-[:WROTE]->(r:Review) RETURN toFloat(avg(r.stars))"
              )
      numReviews: Int
        @cypher(statement: "MATCH (this)-[:WROTE]->(r:Review) RETURN COUNT(r)")
  }

  type Business {
      id: ID!
        name: String
      address: String
      city: String
      state: String
      reviews: [Review] @relation(name: "REVIEWS", direction: "IN")
      categories: [Category] @relation(name: "IN_CATEGORY", direction: "OUT")
  }

  type Review {
      id: ID!
        stars: Int
      text: String
      date: Date
      business: Business @relation(name: "REVIEWS", direction: "OUT")
      user: User @relation(name: "WROTE", direction: "IN")
  }

  type Category {
      name: ID!
        businesses: [Business] @relation(name: "IN_CATEGORY", direction: "IN")
  }

  type Query {
      usersBySubstring(substring: String): [User]
        @cypher(
                statement: "MATCH (u:User) WHERE u.name CONTAINS $substring RETURN u"
              )
  }
`

const driver = neo4j.driver(
  'bolt://localhost:7687',
  neo4j.auth.basic('neo4j', 'neo4j')
)

const schema = makeAugmentedSchema({ typeDefs })

const server = new ApolloServer({
  context: { driver },
  schema
})

server
  .listen(8000)
  .then(() => console.log('API listening on port 8000'))
