import React, { useEffect, useState } from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Alert from '@mui/material/Alert';
/* import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete'; */
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'

const includedInSelectedCoins = (selectedCoins, coin) => {
	console.log("selectedCoins, coin", selectedCoins, coin)
	for (const selectedCoin of selectedCoins) if(selectedCoin && selectedCoin.name === coin.name) return true
	return false
}

const deleteSelectedCoin = (selectedCoins, coinToDelete) => {
	return selectedCoins.filter(selectedCoin => selectedCoin.name !== coinToDelete.name)
}

const deleteFirstNullSelectedCoin = (selectedCoins) => {
	return selectedCoins.filter(selectedCoin => selectedCoin !== null)
}

const replaceFirstNull = (selectedCoins, newCoin) => {
	let nullFlag = false
	const filteredCoins = selectedCoins
		.map(selectedCoin => {
			if(selectedCoin === null && !nullFlag){
				nullFlag = true
				return newCoin
			}
			else return selectedCoin
		})
	return filteredCoins
}

const replaceSelectedCoin = (selectedCoins, previousCoin, newCoin) => {
	//console.log("replacing selectedCoins, previousCoin, newCoin", selectedCoins, previousCoin, newCoin)
	if(selectedCoins.length === 0) return [{...newCoin}]
	if(previousCoin === null){
		// replace first null with new coin
		return replaceFirstNull(selectedCoins, newCoin)
	}
	else{
		if(includedInSelectedCoins(selectedCoins, previousCoin)){
			const filteredCoins = selectedCoins
				.map(selectedCoin => {
					/* console.log("selectedCoin, previousCoin", selectedCoin, previousCoin) */
					if(selectedCoin && previousCoin && selectedCoin.name === previousCoin.name) return newCoin
					else return selectedCoin
				})
			return filteredCoins
		}
		else{
			return replaceFirstNull(selectedCoins, newCoin)
		}
	}
}

const handleValueChange = (from, newValue, value, setValue, selectedCoins, setSelectedCoins, baseCoin, setAlreadySelected) => {
	if(from){
		if(includedInSelectedCoins(selectedCoins, newValue)){
			setAlreadySelected(true)
				setTimeout(() => {
					setAlreadySelected(false)
				}, 1500);
		}
		else{
			setValue(newValue)
			setSelectedCoins([newValue])
		}
	}
	else{
		if(newValue === null){
			const updatedSelectedCoins = deleteSelectedCoin(selectedCoins, value)
			setSelectedCoins(updatedSelectedCoins)
			setValue(null)
		}
		else{
			const includedInSelected = includedInSelectedCoins(selectedCoins, newValue)
			const includedInBase = baseCoin.name === newValue.name
			
			//console.log("includedinselected, includedInBase", includedInSelected, includedInBase)
			if (includedInSelected || includedInBase){
				setValue(value)
				setAlreadySelected(true)
				setTimeout(() => {
					setAlreadySelected(false)
				}, 1500);
			}
			else {
				const updatedSelectedCoins = replaceSelectedCoin(selectedCoins, value, newValue)
				//console.log("updatedSelectedCoins", updatedSelectedCoins)
				setSelectedCoins(updatedSelectedCoins)
				setValue(newValue)
			}
		}
	} 
}

const CoinSelector = ({from, coins, selectedCoins, setSelectedCoins, baseCoin, coinName, index = null }) => {
	const [alreadySelected, setAlreadySelected] = useState(false)
	const [value, setValue] = useState(index || index === 0 ? coins[index] : null);

	if(value && coinName !== value.name){
		const coin = coins.find(coin => coin.name === coinName)
		if(coin) setValue(coin)
	}

	return (
		<>
		<Grid container>
			<Grid item xs>
				{/* {JSON.stringify({name: coinName ? coinName : null, internal: value ? value.name : null})} */}
				<Autocomplete
					id="coin-select"
					disableClearable
					sx={{ width: 300 }}
					options={coins}
					autoHighlight
					getOptionLabel={(option) => option.name}
					renderInput={(params) => (
						<TextField
							{...params}
							margin="normal"
							fullWidth
							label={from ? "From" : "To"}
							variant="standard"
						/>
					)}
					value={value}
					isOptionEqualToValue={(option, value)=>option.name === value.name}
					onChange={(event, newValue) => {
						handleValueChange(from, newValue, value, setValue, selectedCoins, setSelectedCoins, baseCoin, setAlreadySelected)
					}}
				/>

			</Grid>
			<Grid item>
				{!from && 
				<Button
					disabled = {from}
					fullWidth
					variant="contained"
					sx={{ mt: 3, mb: 2 }}
					onClick={() => {
						//console.log("deleting ", value.name)
						if(!value){
							const updatedSelectedCoins = deleteFirstNullSelectedCoin(selectedCoins)
							setSelectedCoins(updatedSelectedCoins)
						}
						else{
							const updatedsSelectedCoins = deleteSelectedCoin(selectedCoins, value)
							setSelectedCoins(updatedsSelectedCoins)
						}
					}}
				> delete
				</Button>
				}
			</Grid>
		</Grid>
		{ alreadySelected &&
		<Alert severity="error">Already selected coin, select other.</Alert>}
		</>
	);
}

export default CoinSelector