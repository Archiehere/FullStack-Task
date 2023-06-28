import { useState } from 'react'
// import Button from '@mui/material/Button';
import LoadingButton from '@mui/lab/LoadingButton';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import axios from 'axios';
import './App.css'

function App() {

  
//create a state variable to store the value of the input field string
const [inputValue, setInputValue] = useState('')
//create a state of result to store the result of the api call
const [result, setResult] = useState('Result will be shown here')
//loading state
const [loading, setLoading] = useState(false)
//audioUrl state
const [audioUrl, setAudioUrl] = useState('')

function handleapi(){
  setLoading(true);
 axios.post('http://13.236.116.203:8080/translate',{
    text: inputValue,
    target: 'hi'
  }).then((res)=>{

    setResult(res.data.textdata);
    console.log(res.data.textdata);
    let audioData = res.data.audiodata.audioContent.data;

    // Convert the audio data to a Blob
    let audioBlob = new Blob([new Uint8Array(audioData)], { type: 'audio/wav' });

    // Create a Blob URL
    let audioUrl = URL.createObjectURL(audioBlob);
    let audioElement = new Audio(audioUrl);
    audioElement.play();
    setAudioUrl(audioUrl);  
    setLoading(false);
  }
  ).catch((err)=>{
    console.log(err);
    setLoading(false);
 } ) 
}
  return (
//create a div with an input field and a button using material ui and return it
<>
<div className='container'>
<h2>Input English Text here!</h2>
<TextField id="outlined-basic" label="Outlined" variant="outlined" value={inputValue} onChange={(e)=>{
  setInputValue(e.target.value);
}}/>
 <LoadingButton
          size="small"
          onClick={handleapi}
          loading={loading}
          loadingIndicator="Loading…"
          variant="outlined"
        > <span>Fetch data</span>
        </LoadingButton>
<h3>Output Hindi Text:-</h3>
<Paper elevation={10} className='result'> {result} </Paper>
{/* <PlayArrowIcon style={{type:'button' , color:'white',padding:'0.5rem',background:'black',cursor:'pointer'}} /> */}
<div>{audioUrl ? 
<div>
<audio controls key={audioUrl}>
  <source src={audioUrl} type="audio/wav" />
</audio>
<br />
<br />
<a href={audioUrl} download="audio.wav">
          Download Audio
        </a>
</div>
: null}
    </div>
</div>
</>
  )  
}

export default App







