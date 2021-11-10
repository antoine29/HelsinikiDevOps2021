import React, { useState, useEffect } from 'react';
import './App.css';

import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';

import CoinSelector from './components/CoinSelector'
import ExchangesView from './components/ExchangesView'
import { GetCoins } from './services/Coins'

const theme = createTheme();

const getApiCoinsCall = async (setApiCoins, setBseCoin, setSelectedCoins) => {
  const apiCoins = await GetCoins()
  if(!apiCoins){
    setApiCoins(null)
  }
  else{
    setApiCoins(apiCoins)
    setBseCoin([apiCoins[0]])
    setSelectedCoins([apiCoins[1]])
  }
}

const App = () => {
  const [apiCoins, setApiCoins] = useState([])
  const [baseCoin, setBaseCoin] = useState([])
  const [selectedCoins, setSelectedCoins] = useState([])

  useEffect(()=>{
    getApiCoinsCall(setApiCoins, setBaseCoin, setSelectedCoins)
  }, []);

  if(apiCoins && apiCoins.length > 0){
    return (
      <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        {/* {JSON.stringify(selectedCoins.map(sc => sc ? sc.name : null))} */}
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Typography component="h1" variant="h5">Crypto Exchange EDITED</Typography>
          <Box noValidate sx={{ mt: 1 }}>
            <CoinSelector
              from={true}
              coins={apiCoins}
              selectedCoins={selectedCoins}
              setSelectedCoins={setBaseCoin}
              index={0}
            />

            {(selectedCoins[0] || selectedCoins[0] === null) &&
            <CoinSelector
              from={false}
              coins={apiCoins}
              selectedCoins={selectedCoins}
              setSelectedCoins={setSelectedCoins}
              index={1}
              baseCoin={baseCoin[0]}
              coinName={selectedCoins[0].name ? selectedCoins[0].name : null}
            />}

            {selectedCoins.map((selectedCoin, index) => index > 0 ?
            <CoinSelector
              from={false}
              coins={apiCoins}
              selectedCoins={selectedCoins}
              setSelectedCoins={setSelectedCoins}
              baseCoin={baseCoin[0]}
              coinName={selectedCoin ? selectedCoin.name : null}
            /> : null
            )}
            <Grid container>
              <Grid item xs>
              </Grid>
              <Grid item>
              <Button
                disabled = {selectedCoins.includes(null)}
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                onClick={() => {
                  if(selectedCoins.length === 0){
                    setSelectedCoins([{...apiCoins[1]}])
                  }
                  else{
                    setSelectedCoins([...selectedCoins, null])
                  }
                } }
              > Add crypto
              </Button>
              
              {/* <Button onClick={() => {
                console.log(selectedCoins.map(sc => sc ? sc.name : sc))}}>selected coins
              </Button>

              <Button onClick={() => {
                console.log(baseCoin.map(bc => bc && bc.name ? bc.name : null))}}>base coins
              </Button> */}
              </Grid>
            </Grid>
            <ExchangesView baseCoin={baseCoin[0]} selectedCoins={selectedCoins}/>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
    )
  }

  if(!apiCoins){
    return(<p>Error reaching API</p>)
  }

  return (<p>loading</p>)
}

export default App
