import React from 'react'
import ReactDOM from 'react-dom/client'
import TestBackend from './TestBackend'

const App = () => (
	<>
		<h1>Donatello Frontend</h1>
		<TestBackend />
	</>
)

ReactDOM.createRoot(document.getElementById('root')).render(<App />)
