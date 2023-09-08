import fs from 'fs'
//import csv from 'csvtojson'
//import Papa from 'papaparse'
//import * as csv from 'convert-csv-to-json'
import * as mysql from 'mysql'
import * as dotenv from "dotenv"
dotenv.config()

const { DB_PASSWORD } = process.env


export const readCSVFile = async (file: string) => {

    /*
    const lines = file.split("\n");

    let result: any = [];

    let headers = lines[0].split(",");

    for (let i = 1; i < lines.length; i++) {

        let obj: any = {};
        let currentline = lines[i].split(",");

        for (var j = 0; j < headers.length; j++) {
            obj[headers[j]] = currentline[j];
        }

        result.push(obj);

    }
    */
    //return result; //JavaScript object
    //return JSON.stringify(result); //JSON
}

export const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: DB_PASSWORD,
    database: 'shopper_db'
})
