process.env.NODE_ENV = 'test';

const chai = require('chai');
const should = chai.should();
const chaiHttp = require('chai-http');
chai.use(chaiHttp);

const server = require('../src/app');
const knex = require('../src/db/connection');

describe('Movies API Routes', () => {

  beforeEach(() => {
    return knex.migrate.rollback()
    .then(() => { return knex.migrate.latest(); })
    .then(() => { return knex.seed.run(); });
  });

  afterEach(() => {
    return knex.migrate.rollback();
  });

  // describe('GET /api/1/movies/ping', () => {
  //   it('should return "pong"', () => {
  //     chai.request(server)
  //     .get('/api/1/movies/ping')
  //     .end((err, res) => {
  //       console.log('res type', res)
  //       res.type.should.eql('application/json');
  //       res.message.should.eql('pong');
  //     });
  //   });
  // });

  describe('GET /api/movies-service/movies/user', () => {
    it('should return saved movies', () => {
      chai.request(server)
      .get('/api/v1/movies/user?user=1')
      // .set('authorization', `Bearer foobar`)
      .end((err, res) => {
        res.type.should.equal('application/json');
        res.body.status.should.equal('success');
        res.body.data.should.be.a('array');
        res.body.data.length.should.equal(1);
        res.body.data[0].should.have.property('user_id');
        res.body.data[0].should.have.property('title');
        res.body.data[0].should.have.property('created_at');
      });
    });
  });

  describe('POST  /api/movies-service/movies', () => {
    it('should create a new movie', () => {
      chai.request(server)
      .post('/api/v1/movies')
      .set('authorization', `Bearer foobar`)
      .send({ user_id: 1, title: 'Jurrasic World' })
      .end((err, res) => {
        res.should.have.status(200);
        res.type.should.equal('application/json');
        res.body.should.be.a('object');
        res.body.status.should.equal('success');
        res.body.data.should.equal('Movie Added!');
        chai.request(server)
        .get('/api/v1/movies/user?user=1')
        // .set('authorization', `Bearer foobar`)
        .end((err, res) => {
          res.type.should.equal('application/json');
          res.body.status.should.equal('success');
          res.body.data.should.be.a('array');
          res.body.data.length.should.equal(2);
          res.body.data[1].title.should.eql('Jurrasic World');
        });
      });
    });
  });

});
