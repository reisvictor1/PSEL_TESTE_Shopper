import { useState, useEffect } from 'react';
import axios from 'axios'
import Papa from "papaparse"
import './App.css';


const URL = `http://localhost:5000`


function App() {

  const [ valid, setValid] = useState(false)
  const [ isError, setIsError ] = useState(false)
  const [ file, setFile ] = useState();
  const [ keys, setKeys ] = useState([])
  const [ products, setProducts ] = useState([])

  
  useEffect(() => {

  }, [valid, products, keys])

  const handleFileChange = (e) => {
    if(e.target.files){
      setFile(e.target.files[0])
    }
  };

  const handleUpdateBtn = () => {

    axios.post(`${URL}/update`, {
      products
    }).then((res) => {
      return res.data
    }).then((data) => {
      setValid(!data.new_query)
    })

  }

  const handleUploadClick = () => {

    if(!file) return;

    Papa.parse(file, {
      complete: (results) => {
      
        axios.post(`${URL}/validate`, {
          jsonData: results.data
        })
        .then((res) => {
          return res.data
        })
        .then((data) => {
          let sumErrors = 0
          setKeys(data.keys)
          setProducts(data.products)
          
          products.map((product) => {
            if(product.erros.length > 0) sumErrors++
          })

          if(!sumErrors) setValid(true)

          return data
        })
        .catch((err) => {
          localStorage.setItem('errorMsg', err)
          setIsError(true)
        })

      }
    })

  }
 
  return (
    <div className="App">
      <div className='wrapper'>
        <img src="/shopper_logo.png" alt="Logo Shopper" />
        <p>Envie um arquivo .csv:</p>
        <div className='btnContainer'>
          <div className='file-upload'>
            <input id='file-upload' className='file-input' type="file" name='Selecionar' onChange={handleFileChange} placeholder="Selecionar arquivo .csv" />
          </div>
          
          <button onClick={handleUploadClick} >VALIDAR</button>
          <button className={!valid ? 'disabled':''} disabled={!valid} onClick={handleUpdateBtn} >ATUALIZAR</button>
        </div>
        {
          valid ? (
            <div className='product-list'>  
                <div className='product'>
                  <div className='light-green'>{keys[0]}</div>
                  <div className='dark-green'>{keys[1]}</div>
                  <div className='light-green'>{keys[2]}</div>
                  <div className='dark-green'>{keys[3]}</div>
                </div>
              {   
                 products.map(({code, name, current_price, new_price, erros}) => {
                  return(
                    <div className='product'>
                      <div className='light-green'>{code}</div>
                      <div className='dark-green'>{name}</div>
                      <div className='light-green'>{current_price}</div>
                      <div className='dark-green'>{new_price}</div>   
                      {
                        erros.length ? (
                          <div>
                            {
                              erros.map((err) => {
                                return (
                                  <p>{err}</p>
                                )
                              })
                            }
                          </div>
                        ): ''
                      }
                    </div>
                  );
                }) 
              }
            </div>
          ) :  isError ? (
            <div className='errorWrapper'>
              <p>{localStorage.getItem('errorMsg')}</p>
            </div>
          ) : '' 
        }
      </div>
    </div>
  );
}

export default App;
