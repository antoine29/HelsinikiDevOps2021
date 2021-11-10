import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import { GetExchange } from '../services/Coins'


const getExchanges = async (baseCoin, selectedCoins, stateExchanges) => {
	const result = {}

	if(!baseCoin) return result

	result[baseCoin.name] = 1

	for (let index = 0; index < selectedCoins.length; index++) {
		const selectedCoin = selectedCoins[index]
		if(stateExchanges && selectedCoin && Object.keys(stateExchanges).includes(selectedCoin.name)){
			console.log("reusing state exchange")
			result[selectedCoin.name] = stateExchanges[selectedCoin.name]
		}
		else{
			console.log("requesting state exchange")
			if (baseCoin && baseCoin.id && selectedCoin && selectedCoin.id) {
				const exchange = await GetExchange(baseCoin.id, selectedCoin.id)
				result[selectedCoin.name] = exchange.price
				// to avoid API throtling
				await new Promise(resolve => setTimeout(resolve, 500));
			}
		}

	}

	/* console.log("exchanges ;", result) */
	return result
}

const ExchangesView = ({ baseCoin, selectedCoins }) => {

	const [exchanges, setExchanges] = useState(null)

	useEffect(() => {
		/* console.log("exchanges effect") */
		const getExchangesCall = async () => {
			if (selectedCoins.length > 0) {
				let updatedExchanges = await getExchanges(baseCoin, selectedCoins, exchanges)
				setExchanges(updatedExchanges)
			}
		}

		getExchangesCall()
	}, [baseCoin, selectedCoins])


	if (baseCoin && selectedCoins && selectedCoins.length > 0) {
		return (
			<div>
				{exchanges && Object.keys(exchanges).length > 0 &&
					<>
						<p>
							{`1 ${Object.keys(exchanges)[0]}`}
						</p>
						{
							Object.keys(exchanges).map((coinName, index) => index !== 0 ? <p>{`= ${exchanges[coinName]} ${coinName}`}</p> : null)
						}
					</>}
				
				{/* <Button onClick={() => {
					console.log(exchanges)}}>exchanges
        </Button> */}
			</div>
		)
	}

	if(selectedCoins.length === 0){
		return null
	}

	return <p>loading</p>
}

export default ExchangesView