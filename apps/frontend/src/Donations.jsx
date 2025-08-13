import React, { useContext, useEffect, useState } from 'react';
import ConfirmModal from './ConfirmModal';
import AuthContext from './AuthContext';

const API = 'http://localhost:4000';

export default function Donations() {
	const { token, user } = useContext(AuthContext);
	const [items, setItems] = useState([]);

	const auth = token ? { Authorization: `Bearer ${token}` } : {};

	const load = async () => {
		const res = await fetch(`${API}/donations`, { headers: auth });
		const data = await res.json();
		setItems(data);
	};

	useEffect(() => { if (token) load(); }, [token]);

	const [confirmAccept, setConfirmAccept] = useState(null); // id o null
	const [confirmDeliver, setConfirmDeliver] = useState(null); // id o null
	const [modalError, setModalError] = useState("");

	const accept = async (id) => {
		try {
			const res = await fetch(`${API}/donations/${id}/accept`, { method: 'PATCH', headers: auth });
			if (!res.ok) throw new Error('Error al aceptar donación');
			load();
			setConfirmAccept(null);
			setModalError("");
		} catch (e) {
			setModalError(e.message);
		}
	};

	const deliver = async (id) => {
		try {
			const res = await fetch(`${API}/donations/${id}/deliver`, { method: 'PATCH', headers: auth });
			if (!res.ok) throw new Error('Error al confirmar entrega');
			load();
			setConfirmDeliver(null);
			setModalError("");
		} catch (e) {
			setModalError(e.message);
		}
	};

	return (
		<div className="max-w-2xl mx-auto">
			<h2 className="text-xl font-bold mb-4">Donaciones</h2>
			<ul className="space-y-3">
				{items.map(d => (
					<li key={d.id} className="bg-white p-4 rounded shadow">
						<div className="flex justify-between items-center">
							<div>
								<div className="font-semibold">{d.title}</div>
								<div className="text-sm text-gray-600">Estado: {d.status}</div>
								<div className="text-xs text-gray-500">Donante: {d.donor_id} | Receptor: {d.receiver_id}</div>
							</div>
							<div className="flex gap-2">
														{d.status === 'proposed' && d.receiver_id === user.id && (
															<>
																<button onClick={() => setConfirmAccept(d.id)} className="bg-green-600 text-white px-3 py-1 rounded">Aceptar</button>
																<ConfirmModal
																	open={confirmAccept === d.id}
																	title="Confirmar aceptación"
																	message={
																		<div>
																			<div className="mb-2">¿Seguro que quieres aceptar esta donación?</div>
																			<div className="text-sm text-gray-700 mb-1"><b>Título:</b> {d.title}</div>
																			<div className="text-sm text-gray-700 mb-1"><b>Descripción:</b> {d.description}</div>
																			<div className="text-sm text-gray-700 mb-1"><b>Categoría:</b> {d.category}</div>
																			<div className="text-sm text-gray-700 mb-1"><b>Ubicación:</b> {d.location}</div>
																			<div className="text-sm text-gray-700 mb-1"><b>Donante (ID):</b> {d.donor_id}</div>
																		</div>
																	}
																	onCancel={() => { setConfirmAccept(null); setModalError(""); }}
																	onConfirm={() => accept(d.id)}
																/>
																{modalError && confirmAccept === d.id && (
																	<div className="text-red-600 text-sm mt-2">{modalError}</div>
																)}
															</>
														)}
											{d.status === 'accepted' && d.donor_id === user.id && (
												<>
													<button onClick={() => setConfirmDeliver(d.id)} className="bg-blue-600 text-white px-3 py-1 rounded">Confirmar entrega</button>
													<ConfirmModal
														open={confirmDeliver === d.id}
														title="Confirmar entrega"
														message={
															<div>
																<div className="mb-2">¿Seguro que quieres marcar esta donación como entregada?</div>
																<div className="text-sm text-gray-700 mb-1"><b>Título:</b> {d.title}</div>
																<div className="text-sm text-gray-700 mb-1"><b>Descripción:</b> {d.description}</div>
																<div className="text-sm text-gray-700 mb-1"><b>Categoría:</b> {d.category}</div>
																<div className="text-sm text-gray-700 mb-1"><b>Ubicación:</b> {d.location}</div>
																<div className="text-sm text-gray-700 mb-1"><b>Donante (ID):</b> {d.donor_id}</div>
																<div className="text-sm text-gray-700 mb-1"><b>Receptor (ID):</b> {d.receiver_id}</div>
															</div>
														}
														onCancel={() => { setConfirmDeliver(null); setModalError(""); }}
														onConfirm={() => deliver(d.id)}
													/>
													{modalError && confirmDeliver === d.id && (
														<div className="text-red-600 text-sm mt-2">{modalError}</div>
													)}
												</>
											)}
							</div>
						</div>
					</li>
				))}
				{items.length===0 && <li className="text-gray-600">Sin donaciones</li>}
			</ul>
		</div>
	);
}
