
const request = require('supertest')
const app = "http://localhost:4000/graphql"
const  path = require('path');

const desiredResponse = {
    data: {
      singleUpload: {
        min:{
            code:expect.any(String),
            growth:expect.any(Number),
        },
        max:{
            code:expect.any(String),
            growth:expect.any(Number),
        }
      }
    },
};

describe('Graphql Endpoints', () => {
  it('returns responds status 200 and data in response', async () => {
    const file = path.resolve(__dirname, `./stock.csv`);
    const res = await request(app)
      .post('/')
      .set('x-apollo-operation-name', 'multipart/form-data')
      .field('operations','{"query":"mutation SingleUpload($file: Upload!) {\\nsingleUpload(file:$file ){\\nmin{\\ncode\\ngrowth\\n}\\nmax {\\ncode\\ngrowth\\n}\\n}\\n}"}')
      .field('map','{"0": ["variables.file"]}')
      .attach('0', file)
    expect(200)
    expect(res.body).toEqual(desiredResponse)
  })
})

describe('Graphql Endpoints', () => {
    it('returns responds status 400 ( bad request) in response with wrong schema', async () => {
      const file = path.resolve(__dirname, `./stock.csv`);
      const res = await request(app)
        .post('/')
        .set('x-apollo-operation-name', 'multipart/form-data')
        .field('map','{"0": ["variables.file"]}')
        .attach('0', file)
      expect(400)
    })
  })

