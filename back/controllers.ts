import { response } from "express";
import { connection } from "./utils";


const selectPackQuery = async (code: any) => {

    return new Promise((resolve, reject) => {
        connection.query(`SELECT * FROM packs WHERE pack_id='${code}'`, (err, result) => {
            if(err) return reject(err)

            resolve(result)
        })
    })
}


const selectProductOnPackQuery = async (code: any) => {


    return new Promise((resolve, reject) => {
        connection.query(`SELECT * FROM packs WHERE product_id='${code}'`, (err, result) => {
            if(err) return reject(err)

            resolve(result)
        })
    })
}

const updatePriceOnProduct = async (code: any, price: any) => {

    return new Promise((resolve, reject) => {
        connection.query(`UPDATE products SET sales_price=${price} WHERE code='${code}'`, (err, result) => {
            if(err) return reject(err)

            resolve(result)
        })
    })

}

const validateQuery = async (row: any) => {


    return new Promise((resolve, reject) => {
        connection.query(`SELECT * FROM products WHERE code='${row[0]}'`, (err, result) => {
            if(err) return reject(err)

            resolve(result)
        })
    })
}

export const validateCSV = async (req: any, res: any) => {

    const { jsonData } = req.body

    let dataKeys = jsonData[0]


    jsonData.shift()

    // Verifica se os campos necessários existem
    /*
    if(dataKeys[0] != "product_code" || dataKeys[1] != "new_price"){
        res.statusCode = 400
        res.statusCode = `Não há os campos necessários para a validação`
        res.end()
    }
    */
    

    let productArray: any[] = []
    let productCodesOnPacks: any[] = []
    let sumProductsOnPacks = 0
    
    const keysValues = ["Codigo", "Nome", "Preço Atual", "Novo Preço"]

    for(let i = 0; i < jsonData.length; i++){

        let productErros: any[] = []

        const packProduct: any = await selectPackQuery(jsonData[i][0])
        
        if(packProduct.length > 0){
            productCodesOnPacks.push(packProduct[0].product_id)
            sumProductsOnPacks++;
        }

        const results: any = await validateQuery(jsonData[i])

        // Verifica se o código existe
        if(!results.length){
            productErros.push(`O código do produto não existe.`)
        }

        results.map(async (res_data: any) => {

            // Verifica se o preço é um valor numérico válido
            if(isNaN(parseFloat(jsonData[i][1]))){
                productErros.push(`O preço não é um valor numérico válido`)  
            }

            // Verifica se o novo preço é menor que o valor de custo
            if(jsonData[i][1] < res_data.cost_price) {
                productErros.push(`O valor da venda do produto não pode ser menor que o valor de custo do produto.`)
            } 
            
            // Verifica se o novo preço é 10% maior ou menor que o preço atual
            if(jsonData[i][1] > res_data.sales_price*1.10 || jsonData[i][1] < res_data.sales_price*0.90 ){
                productErros.push(`O valor de reajuste do preço de venda do produto não pode ser 10% maior ou menor que o preço atual`)
            }

            // Verifica se o produto está em algum pacote
            for(let j = 0; j < productCodesOnPacks.length; j++){
                if(jsonData[i][0] == productCodesOnPacks[j]){
                    sumProductsOnPacks--;
                    productCodesOnPacks.splice(j,1);
                }
            }

        
            const newObj = {
                code: jsonData[i][0],
                name: results[0].name,
                current_price: results[0].sales_price,
                new_price: jsonData[i][1],
                erros: productErros
            }
            productArray.push(newObj)
        
        })

    }
   
    if(sumProductsOnPacks > 0){

        productCodesOnPacks.map((packProduct) => {
            packProduct.erros.push('Não tem os produtos do pacote no arquivo')
        })

    }

    const finalJson = {
        valid: true,
        keys: keysValues,
        products: productArray,
    
    }

    res.statusCode = 200

    return res.send(finalJson)

} 

export const updateDB = async (req: any, res: any) => {

    const { products } = req.body

   
    products.map(async (product: any) => {
    
        const { code, new_price } = product
      
        await updatePriceOnProduct(code, new_price)

    })


    return res.status(200).send({
        new_query: true
    })

}