import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import TestBackend from './TestBackend'
import AuthForm from './AuthForm'
import { AuthProvider } from './AuthContext'

const App = () => (
	<AuthProvider>
		<h1>Donatello Frontend</h1>
		<AuthForm />
		<TestBackend />
	</AuthProvider>
)

ReactDOM.createRoot(document.getElementById('root')).render(<App />)
