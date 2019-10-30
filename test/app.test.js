const { expect } = require('chai');
const supertest = require('supertest');
const app = require('../app');


describe('NYT server app', () => {

  it('returns full list of books given no query params', () => {
    return supertest(app)
      .get('/books')
      .expect(200)
      .expect('Content-Type', /json/)
      .then(res => {
        expect(res.body).to.be.an('array');
        expect(res.body).to.have.lengthOf(20);
        const book = res.body[0];
        expect(book).to.include.all.keys(
          'bestsellers_date', 'author', 'description', 'title'
        );
      });
  });

  it('returns a 400 error if sort is incorrect', () => {
    return supertest(app)
      .get('/books')
      .query({sort: 'INVALID'})
      .expect(400, 'Sort must be one of title or rank');
  });

  it('should sort by title', () => {
    return supertest(app)
      .get('/books')
      .query({sort: 'title'})
      .expect(200)
      .expect('Content-Type', /json/)
      .then(res => {
        expect(res.body).to.be.an('array');
        let sorted = true;
        let i = 0;
        while (i < res.body.length - 1) {
          const bookAtI = res.body[i];
          const bookAtIPlus1 = res.body[i + 1];
          if (bookAtIPlus1.title < bookAtI.title){
            sorted =false;
            break;
          }
          i++;
        }
        expect(sorted).to.be.true;
      }); 
  });
});