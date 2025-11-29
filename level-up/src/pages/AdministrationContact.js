
import React, { useState, useEffect } from 'react';
import axiosInstance from '../config/axiosConfig';
import Toast from '../components/Toast';
import './Administration.css';

function AdministrationContact() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');

  useEffect(() => {
    const fetchContacts = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.get('/api/contact-messages');
        let contactsData = [];
        if (response.data._embedded && response.data._embedded.contactMessageList) {
          contactsData = response.data._embedded.contactMessageList;
        } else if (Array.isArray(response.data)) {
          contactsData = response.data;
        } else if (response.data.content) {
          contactsData = response.data.content;
        }
        setContacts(contactsData);
      } catch (error) {
        setToastMessage('Error al cargar mensajes de contacto');
        setToastType('error');
        setShowToast(true);
      } finally {
        setLoading(false);
      }
    };
    fetchContacts();
  }, []);

  return (
    <div className="administration-page">
      <Toast 
        show={showToast}
        message={toastMessage}
        type={toastType}
        onClose={() => setShowToast(false)}
      />
      <div className="container-fluid py-4">
        <div className="row mb-4">
          <div className="col-12">
            <div className="card shadow-sm">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h3 className="mb-0">Gestión de Mensajes de Contacto</h3>
                </div>
                {loading ? (
                  <div className="text-center py-5">
                    <div className="spinner-border text-primary" role="status">
                      <span className="visually-hidden">Cargando...</span>
                    </div>
                  </div>
                ) : (
                  <div className="table-responsive">
                    <table className="table table-hover">
                      <thead className="table-light">
                        <tr>
                          <th>ID</th>
                          <th>Nombre</th>
                          <th>Email</th>
                          <th>Fecha y hora</th>
                          <th>Asunto</th>
                          <th>Mensaje</th>
                          <th>User ID</th>
                        </tr>
                      </thead>
                      <tbody>
                        {contacts.length === 0 ? (
                          <tr>
                            <td colSpan="7" className="text-center py-4">
                              No hay mensajes de contacto
                            </td>
                          </tr>
                        ) : (
                          contacts.map((contact, index) => (
                            <tr key={contact.id || index}>
                              <td>{contact.id}</td>
                              <td>{contact.name}</td>
                              <td>{contact.email}</td>
                              <td>{contact.createdAt ? new Date(contact.createdAt).toLocaleString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'}) : ''}</td>
                              <td>{contact.subject}</td>
                              <td>{contact.message}</td>
                              <td>{contact.user_id}</td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdministrationContact;
