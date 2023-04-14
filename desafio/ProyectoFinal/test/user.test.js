import chai from 'chai'
import supertest from 'supertest'
import { faker } from '@faker-js/faker'
import logger from '../src/utils/logger.js'
import _ from 'mongoose-paginate-v2'

const expect = chai.expect
const requester = supertest('http://127.0.0.1:8080')

// describe('Registro, Login and Current', () => {
//     let cookie;

//     const mockUser = {
//         first_name: faker.name.firstName(),
//         last_name: faker.name.lastName(),
//         email: faker.internet.email(),
//         password: 'secret',
//         role: 'admin'
//     }

//     it('Debe registrar un usario', async () => {
//         const {header} = await requester.post('/session/register').send(mockUser)
        
//         expect(header.location = '/session/login').to.be.ok
//     })

//     it('Debe loguear un user y DEVOLVER UNA COOKIE', async () => {
//         const result = await requester.post('/session/login').send({
//             email: mockUser.email, password: mockUser.password
//         })

//         //COOKIE_NAME=COOKIE_VALUE
//         const cookieResult = result.headers['set-cookie'][0]
//         expect(cookieResult).to.be.ok 
//         cookie = {
//             name: cookieResult.split('=')[0],
//             value: cookieResult.split('=')[1]
//         }
//         console.log(cookieResult);
//         expect(cookie.name).to.be.ok.and.eql('coderCookieToken')
//         expect(cookie.value).to.be.ok

//     })

// //     it('enviar cookie para ver el contenido del usuario', async () => {
        
// //         const { _body } = await requester.get('/session/current').set('Cookie', [`${cookie.name}=${cookie.value}`])
        
// //         expect(200)
// //         expect(_body.payload.email).to.be.eql(mockUser.email)
        
// //     })
// })

describe('Test CRUD productos', () => {

    const mockProduct = {
        title: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        price: faker.commerce.price(),
        thumbnail: faker.image.image(),
        code: faker.datatype.string(5),
        stock: faker.datatype.number(100),
        category: faker.commerce.department(),
        status: faker.datatype.boolean()
    }
    
    it('Debe registrar un producto', async () => {
        const result = await requester.post('/api/products').send(mockProduct).set('Cookie', [`coderCookieToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoxMSwiZmlyc3RfbmFtZSI6IkFkw6FuIiwibGFzdF9uYW1lIjoiQmFlemEiLCJlbWFpbCI6IkVtaWxpb19PbG1vc0B5YWhvby5jb20iLCJjYXJ0IjoxNCwicm9sZSI6ImFkbWluIiwibWV0aG9kIjoiTE9DQUwifSwiaWF0IjoxNjgxNDMwNTM3LCJleHAiOjE2ODE1MTY5Mzd9.K9E0P8o4h97eCQDxQMd2TMSfY7EmpAlSIZ6g1vAoDf0`])
        console.log(result._body); 
        expect(result.status).to.be.eql(200)
        expect(result._body.payload).to.have.property('_id' || 'id')
        expect(result._body.payload.image).to.be.ok
    })

    // it('Debe loguear un user y DEVOLVER UNA COOKIE', async () => {
    //     const result = await requester.post('/session/login').send({
    //         email: mockUser.email, password: mockUser.password
    //     })

    //     //COOKIE_NAME=COOKIE_VALUE
    //     const cookieResult = result.headers['set-cookie'][0]
    //     expect(cookieResult).to.be.ok 
    //     cookie = {
    //         name: cookieResult.split('=')[0],
    //         value: cookieResult.split('=')[1]
    //     }

    //     expect(cookie.name).to.be.ok.and.eql('coderCookieToken')
    //     expect(cookie.value).to.be.ok

    // })

    // it('enviar cookie para ver el contenido del usuario', async () => {
        
    //     const { _body } = await requester.get('/session/current').set('Cookie', [`${cookie.name}=${cookie.value}`])
        
    //     expect(200)
    //     expect(_body.payload.email).to.be.eql(mockUser.email)
        
    // })
})