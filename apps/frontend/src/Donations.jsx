import React, { useEffect } from 'react';
import useStore from './store';
import Modal from './Modal';

const API = 'http://localhost:4000';


export default function Donations() {
		const { token, user, modal, openModal, closeModal, userDonations, setUserDonations, showToast } = useStore();
	const [items, setItems] = React.useState([]);
	const [modalError, setModalError] = React.useState("");

	const auth = token ? { Authorization: `Bearer ${token}` } : {};

	const load = async () => {
		const res = await fetch(`${API}/donations`, { headers: auth });
		const data = await res.json();
		setItems(data);
		setUserDonations(data);
	};

	React.useEffect(() => { if (token) load(); }, [token]);

		const accept = async (donation) => {
			try {
				const res = await fetch(`${API}/donations/${donation.id}/accept`, { method: 'PATCH', headers: auth });
				if (!res.ok) throw new Error('Error al aceptar donación');
				load();
				closeModal();
				setModalError("");
				showToast('Donación aceptada correctamente');
			} catch (e) {
				setModalError(e.message);
			}
		};

		const deliver = async (donation) => {
			try {
				const res = await fetch(`${API}/donations/${donation.id}/deliver`, { method: 'PATCH', headers: auth });
				if (!res.ok) throw new Error('Error al confirmar entrega');
				load();
				closeModal();
				setModalError("");
				showToast('Entrega confirmada correctamente');
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
								{d.status === 'proposed' && d.receiver_id === user?.id && (
									<button
										onClick={() => { setModalError(""); openModal('accept', null, d); }}
										className="bg-green-600 text-white px-3 py-1 rounded"
									>Aceptar</button>
								)}
								{d.status === 'accepted' && d.donor_id === user?.id && (
									<button
										onClick={() => { setModalError(""); openModal('deliver', null, d); }}
										className="bg-blue-600 text-white px-3 py-1 rounded"
									>Confirmar entrega</button>
								)}
							</div>
						</div>
					</li>
				))}
				{items.length === 0 && <li className="text-gray-600">Sin donaciones</li>}
			</ul>
			{/* Modal reutilizable para aceptar/deliver */}
			<Modal
				open={modal.open && (modal.type === 'accept' || modal.type === 'deliver')}
				title={modal.type === 'accept' ? 'Confirmar aceptación' : modal.type === 'deliver' ? 'Confirmar entrega' : ''}
				onClose={() => { closeModal(); setModalError(""); }}
			>
				{modal.donation && (
					<div>
						<div className="mb-2">
							{modal.type === 'accept' ? '¿Seguro que quieres aceptar esta donación?' : '¿Seguro que quieres marcar esta donación como entregada?'}
						</div>
						<div className="text-sm text-gray-700 mb-1"><b>Título:</b> {modal.donation.title}</div>
						<div className="text-sm text-gray-700 mb-1"><b>Descripción:</b> {modal.donation.description}</div>
						<div className="text-sm text-gray-700 mb-1"><b>Categoría:</b> {modal.donation.category}</div>
						<div className="text-sm text-gray-700 mb-1"><b>Ubicación:</b> {modal.donation.location}</div>
						<div className="text-sm text-gray-700 mb-1"><b>Donante (ID):</b> {modal.donation.donor_id}</div>
						{modal.type === 'deliver' && (
							<div className="text-sm text-gray-700 mb-1"><b>Receptor (ID):</b> {modal.donation.receiver_id}</div>
						)}
						{modalError && <div className="text-red-600 text-sm mt-2">{modalError}</div>}
						<div className="flex gap-2 mt-4">
							<button
								className={modal.type === 'accept' ? 'bg-green-600 text-white px-3 py-1 rounded' : 'bg-blue-600 text-white px-3 py-1 rounded'}
								onClick={() => {
									if (modal.type === 'accept') accept(modal.donation);
									if (modal.type === 'deliver') deliver(modal.donation);
								}}
							>Confirmar</button>
							<button
								className="bg-gray-200 text-gray-800 px-3 py-1 rounded border border-gray-300 hover:bg-gray-300"
								onClick={() => { closeModal(); setModalError(""); }}
							>Cancelar</button>
						</div>
					</div>
				)}
			</Modal>
		</div>
	);
}
