import { readCSVFile } from "./utils";

export const validateCSV = async (req, res) => {

    const { filePath } = req.body

    const data = await readCSVFile(filePath)

    console.log(data)

    data.map((row) => {

        

    })

    return res.status(200).send('OK')

} 

export const updateDB = async (req, res) => {



    return res.status(200).send('OK')

}