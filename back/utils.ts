import fs from 'fs'
import csv from 'csv-parser'

export const readCSVFile = (file: string) => {

    const results: object[] = []

    return new Promise((resolve, reject) => {
        fs.createReadStream(file)
            .pipe(csv())
            .on('data', (data) => results.push(data))
            .on('end', () => resolve(results))
            .on('error', (error) => reject(error))
    })

}

