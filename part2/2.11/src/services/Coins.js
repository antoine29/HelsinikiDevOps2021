import axios from 'axios'

export const GetCoins = async () =>  {
    try{
        //const stubData = require('./GetCoins_StubResponse.json')
        //return stubData
    
        const url = "https://api.coinpaprika.com/v1/coins"
        const response = await axios.get(url)
        return response.data.slice(0, 100)
    }
    catch(error){
        console.log("error", error)
        return null
    }
}

export const GetExchange = async (baseId, targuetId, amount=1) =>  {
    const url = `https://api.coinpaprika.com/v1/price-converter?base_currency_id=${baseId}&quote_currency_id=${targuetId}&amount=${amount}`
    const response = await axios.get(url)
    return response.data
}

export const GetStubCoins = () =>  {
    const stubData = require('./GetCoins_StubResponse.json')
    console.log(stubData)
    return stubData
}