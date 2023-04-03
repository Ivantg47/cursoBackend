import { Router } from "express";
import jwt from 'jsonwebtoken'
import config from "../config/config.js";
import logger from "../utils/logger.js";

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

    post(path, policies, ...callbacks){
        this.router.post(path, this.generateCustomResponses, this.handlePolicies(policies), this.applyCallbacks(callbacks))
    }

    put(path, policies, ...callbacks){
        this.router.put(path, this.generateCustomResponses, this.handlePolicies(policies), this.applyCallbacks(callbacks))
    }

    delete(path, policies, ...callbacks){
        this.router.delete(path, this.generateCustomResponses, this.handlePolicies(policies), this.applyCallbacks(callbacks))
    }

    applyCallbacks(callbacks) {
        return callbacks.map((callback) => async(...params) => {
            try {
                await callback.apply(this, params)
            } catch (error) {
                logger.error(error);
                params[1].status(500).send(error)//params[1] = res
            }
        })
    }

    generateCustomResponses = (req, res, next) => {
        res.sendSuccess = payload => res.status(200).send({status: "success", payload})
        res.sendServerError = error => res.status(500).send({status: "error", error})
        res.sendUserError = error => res.status(400).send({status: "error", error})
        res.sendNoAuthenticatedError = error => res.status(401).send({status: "error", error})
        res.sendNoAuthorizatedError = error => res.status(403).send({status: "error", error})
        res.sendNoFoundError = error => res.status(404).send({status: "error", error})

        next()
    }

    handlePolicies = policies => (req, res, next) => {
        if (policies.includes('PUBLIC')) return next()

        if (policies.includes('USER') || policies.includes('ADMIN') || policies.includes('PREMIUN')) {
            const authHeaders = req.headers.authorization || req.cookies[config.COOKIE_NAME_JWT]
            
            if(!authHeaders) return res.sendNoAuthorizatedError('Unauthorized')

            const tokenArray = authHeaders.split(" ")
            const token = (tokenArray.length > 1) ? tokenArray[1] : tokenArray[0]

            const user = jwt.verify(token, config.JWT_PRIVATE_KEY)
            
            if(!policies.includes(user.user.role.toUpperCase()) ) {
                return res.sendNoAuthorizatedError("Unauthorizated")
            }
            
            req.user = user
            return next()
        }

        next()
    }
}