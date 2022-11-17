const axios = require('axios')


class InvoiceController {
    constructor() {
        this.url = process.env.API_GATEWAY_URL + '/v2/invoices',
        this.headers = {
            'Content-Type': 'application/json'
        },
        this.auth = {
            username: process.env.API_KEY,
            password: ''
        },
        this.timeout = 10000
    }   
 
    async create(data) {
        const options = {
            method: 'POST',
            headers: this.headers,
            // timeout: this.timeout,
            auth: this.auth,
            url: this.url,
            data
        }
        
        try {
            return await axios(options)
        } catch (error) {
            throw error
        } 
    }

    async getInvoice(invoice_id) {
        const options = {
            method: 'GET',
            headers: this.headers,
            // timeout: this.timeout,
            auth: this.auth,
            url: this.url + `/${invoice_id}`
        }

        try {
            return await axios(options)
        } catch (error) {
            throw error
        }
    }
}


module.exports = InvoiceController;