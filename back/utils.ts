import fs from 'fs'
//import csv from 'csvtojson'
//import Papa from 'papaparse'
//import * as csv from 'convert-csv-to-json'
import * as mysql from 'mysql'
import * as dotenv from "dotenv"
dotenv.config()

const { DB_PASSWORD } = process.env

export const connectDB = () => {

    connection.connect()

}

export const disconnectDB = () => {
    connection.end()
}

export const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: DB_PASSWORD,
    database: 'shopper_db'
})
