import { response } from "express";
import { readCSVFile, connection } from "./utils";

/*
 return new Promise((resolve, reject) => {
        Papa.parse(file, {
            complete(results: any, file: any){
                resolve(results.data)
            }, 
            error(err: any, file: any){
                reject(err)
            }
        })
    })
*/

export const validateCSV = async (req: any, res: any) => {

    const { jsonData } = req.body

    let dataKeys = jsonData[0]

    jsonData.shift()

    // Verifica se os campos necessários existem
    if(dataKeys[0] != "product_code" || dataKeys[1] != "new_price"){
        res.statusCode = 400
        res.statusCode = `Não há os campos necessários para a validação`
        res.end()
    }
    

    connection.connect()
 
    
    jsonData.map((row: any) => {
       
        connection.query(`SELECT * FROM products WHERE code='${row[0]}'`, (err, results, fields) => {
            
            console.log(`code: ${row[0]} - new price: ${row[1]} - tam: ${results.length}`)

            // Verifica se o código existe
            if(!results.length){
                res.statusCode = 400
                res.statusMessage = `O código do produto não existe.`
                res.end() 
            }

            results.map((res_data: any) => {

                // Verifica se o preço é um valor numérico válido
                if(isNaN(parseFloat(row[1]))){
                    res.statusCode = 400
                    res.statusMessage = `O preço não é um valor numérico válido`
                    res.end() 
                }

                // Verifica se o novo preço é menor que o valor de custo
                if(row[1] < res_data.cost_price) {
                    res.statusCode = 400
                    res.statusMessage = `O valor da venda do produto não pode ser menor que o valor de custo do produto.`
                    res.end() 
                } 
                
                // Verifica se o novo preço é 10% maior ou menor que o preço atual
                if(row[1] > res_data.sales_price*1,10 || row[1] < res_data.sales_price*0,90 ){
                    res.statusCode = 400
                    res.statusMessage = `O valor de reajuste do preço de venda do produto não pode ser 10% maior ou menor que o preço atual`
                    res.end()
                }
            })
        })
        

    })
    

    connection.end()
    return res.status(200).json({
        valid: true,
        keys: dataKeys,
        values: jsonData
    })

} 

export const updateDB = async (req: any, res: any) => {


    //connection.query(`SELECT * FROM packs WHERE code='${row.product_code}'`)


    return res.status(200).send('OK')

}