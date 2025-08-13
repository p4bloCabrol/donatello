
import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import AuthForm from './AuthForm'
import { AuthProvider } from './AuthContext'
import Listings from './Listings'
import Profile from './Profile'
import Onboarding from './Onboarding'



import { useContext, useEffect } from 'react';
import useStore from './store';
import AuthContext from './AuthContext';
import { BrowserRouter, Routes, Route, Link, Navigate, useNavigate } from 'react-router-dom';
import Landing from './Landing';
import About from './About';
import Contact from './Contact';
import Privacy from './Privacy';

const Toast = ({ duration = 4000 }) => {
	const toast = useStore(s => s.toast);
	const hideToast = useStore(s => s.hideToast);
	useEffect(() => {
		if (!toast) return;
		const t = setTimeout(() => {
			hideToast();
		}, duration);
		return () => clearTimeout(t);
	}, [toast, duration, hideToast]);
	if (!toast) return null;
	return (
		<div className="fixed bottom-4 right-4 z-50 pointer-events-none">
			<div className="pointer-events-auto bg-green-600 text-white px-4 py-2 rounded shadow flex items-center gap-2 animate-fade-in">
				<span>{toast}</span>
				<button onClick={hideToast} className="ml-2 text-white font-bold" aria-label="Cerrar notificación">×</button>
			</div>
		</div>
	);
};

const Topbar = () => {
	const { user, logout } = useContext(AuthContext);
	const navigate = useNavigate();
	const handleLogout = () => {
		logout();
		navigate('/', { replace: true });
	};
	return (
		<header className="bg-blue-700 text-white py-3 px-4 flex items-center justify-between shadow mb-6">
			<Link to="/" className="text-2xl font-bold">Donatello</Link>
			<nav className="flex items-center gap-4">
				{!user && (
					<>
						<Link to="/login" className="hover:underline">Login</Link>
						<Link to="/register" className="hover:underline">Registrarse</Link>
					</>
				)}
				{user && (
					<>
						<Link to="/listings" className="hover:underline">Publicaciones</Link>
						<Link to="/profile" className="hover:underline">Mi perfil</Link>
						<span className="font-semibold">Hola, {user.name}</span>
						<button onClick={handleLogout} className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded text-white font-semibold">Salir</button>
					</>
				)}
			</nav>
		</header>
	);
};

// Landing page moved to its own component

const RequireAuth = ({ children }) => {
	const { user } = useContext(AuthContext);
	if (!user) return <Navigate to="/login" replace />;
	return children;
};

const App = () => {
	return (
		<AuthProvider>
			<BrowserRouter>
				<Topbar />
				<div className="min-h-screen bg-white max-w-4xl mx-auto px-2 pb-16">
					<Routes>
						<Route path="/" element={<Landing />} />
						<Route path="/about" element={<About />} />
						<Route path="/contact" element={<Contact />} />
						<Route path="/privacy" element={<Privacy />} />
						<Route path="/login" element={<AuthForm />} />
						<Route path="/register" element={<AuthForm initialMode="register" />} />
						<Route path="/profile" element={<RequireAuth><Profile /></RequireAuth>} />
|						<Route path="/welcome" element={<Onboarding />} />
						<Route path="/listings" element={<RequireAuth><Listings /></RequireAuth>} />
						<Route path="*" element={<Navigate to="/" replace />} />
					</Routes>
					<Toast />
				</div>
				<footer className="w-full bg-white border-t mt-6">
					<div className="max-w-4xl mx-auto px-4 py-4 text-sm text-gray-600 flex justify-between">
						<span>© {new Date().getFullYear()} Donatello</span>
						<nav className="flex gap-4">
							<Link to="/about" className="hover:underline">Sobre Donatello</Link>
							<Link to="/contact" className="hover:underline">Contacto</Link>
							<Link to="/privacy" className="hover:underline">Privacidad</Link>
						</nav>
					</div>
				</footer>
			</BrowserRouter>
		</AuthProvider>
	);
};

ReactDOM.createRoot(document.getElementById('root')).render(<App />)
