import chai from 'chai'
import supertest from 'supertest'
import { faker } from '@faker-js/faker'
import logger from '../src/utils/logger.js'
import _ from 'mongoose-paginate-v2'

const expect = chai.expect
const requester = supertest('http://127.0.0.1:8080')

describe('Registro, Login and Current', () => {
    let cookie;

    const mockUser = {
        first_name: faker.name.firstName(),
        last_name: faker.name.lastName(),
        email: faker.internet.email(),
        password: 'secret'
    }

    it('Debe registrar un usario', async () => {
        const {header} = await requester.post('/session/register').send(mockUser)
        
        expect(header.location = '/session/login').to.be.ok
    })

    it('Debe loguear un user y DEVOLVER UNA COOKIE', async () => {
        const result = await requester.post('/session/login').send({
            email: mockUser.email, password: mockUser.password
        })

        //COOKIE_NAME=COOKIE_VALUE
        const cookieResult = result.headers['set-cookie'][0]
        expect(cookieResult).to.be.ok 
        cookie = {
            name: cookieResult.split('=')[0],
            value: cookieResult.split('=')[1]
        }

        expect(cookie.name).to.be.ok.and.eql('coderCookieToken')
        expect(cookie.value).to.be.ok

    })

    it('enviar cookie para ver el contenido del usuario', async () => {
        console.log([`${cookie.name}=${cookie.value}`]);
        const _body = await requester.get('/session/current').set('Cookie', [`${cookie.name}=${cookie.value}`])
        console.log("test: ", _body);
        expect(_body.payload.email).to.be.eql(mockUser.email)
    })
})