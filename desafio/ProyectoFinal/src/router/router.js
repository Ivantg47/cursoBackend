import { Router } from "express";
import jwt from 'jsonwebtoken'

export default class MiRouter {

    constructor() {
        this.router = Router()
        this.init()
    }

    getRouter() {
        return this.router
    }

    init(){}

    get(path, policies, ...callbacks){
        this.router.get(path, this.generateCustomResponses, this.handlePolicies(policies), this.applyCallbacks(callbacks))
    }

    post(path, this.generateCustomResponses, ...callbacks){
        this.router.post(path, this.generateCustomResponses, this.handlePolicies(policies), this.applyCallbacks(callbacks))
    }

    put(path, this.generateCustomResponses, ...callbacks){
        this.router.put(path, this.generateCustomResponses, this.handlePolicies(policies), this.applyCallbacks(callbacks))
    }

    delete(path, this.generateCustomResponses, ...callbacks){
        this.router.delete(path, this.generateCustomResponses, this.handlePolicies(policies), this.applyCallbacks(callbacks))
    }

    applyCallbacks(callbacks) {
        return callbacks.map((callback) => async(...params) => {
            try {
                await callback.apply(this, params)
            } catch (error) {
                console.error(error);
                params[1].status(500).send(error)//params[1] = res
            }
        })
    }

    generateCustomResponses = (req, res, next) => {
        res.sendSuccess = payload => res.send({status: "error", payload})
        res.sendServerError = error => res.status(500).send({status: "error", error})
        res.sendUserError = error => res.status(400).send({status: "error", error})
        res.sendNoAuthorizedError = error => res.status(401).send({status: "error", error})

        next()
    }

    handlePolicies = policies => (req, res, next) => {
        if (policies.includes('PUBLIC')) return next()

        if (policies.includes('USER') || policies.includes('ADMIN')) {
            const authHeaders = req.headers.authorization
            if(!authHeaders) return res.sendNoAuthError('Unauthorized')

            const tokenArray = authHeaders.split(" ")
            const token = (tokenArray.length > 1) ? tokenArray[1] : tokenArray[0]

            const user = jwt.verify(token, 'secret')

            if(!policies.includes(user.role.toUpperCase()) ) {
                return res.sendNoAuthorizatedError("Unauthorizated")
            }

            req.user = user
            return next()
        }

        next()
    }
}