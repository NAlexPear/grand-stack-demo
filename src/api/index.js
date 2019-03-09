const { v1: neo4j } = require('neo4j-driver')
const API = require('./api')


const driver = neo4j.driver(
  'bolt://db:7687',
  neo4j.auth.basic('neo4j', 'letmein')
)

const api = new API(driver)

api.start()

