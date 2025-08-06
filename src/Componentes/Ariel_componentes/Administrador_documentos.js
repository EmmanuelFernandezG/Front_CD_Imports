import React, { useState, useEffect } from 'react';
import { Spinner, Accordion, Alert } from 'react-bootstrap';
import { BsFolderFill, BsFileEarmark } from 'react-icons/bs';
import './estilosAriel.css';
import ClientesService from '../../service/ClientesService';

function AdministradorDocumentos() {
  const [organizado, setOrganizado] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    ClientesService.getdocumentos()
      .then(res => {
        setOrganizado(res.data);
      })
      .catch(err => {
        console.error(err);
        setError('Error al cargar los documentos.');
      })
      .finally(() => setCargando(false));
  }, []);

  if (cargando) return <Spinner animation="border" variant="primary" />;
  if (error) return <Alert variant="danger">{error}</Alert>;

  return (
    <div className="container mt-4">
      <h4>📂 Archivos</h4>
      <Accordion defaultActiveKey="0">
        {organizado.map((grupo, idx) => (
          <Accordion.Item eventKey={`${idx}`} key={idx}>
            <Accordion.Header>
              <BsFolderFill className="me-2" />
              {grupo.carpeta || 'Raíz'}
            </Accordion.Header>
            <Accordion.Body>
              {grupo.archivos
                .filter(a => a.nombre.toLowerCase() !== 'desktop.ini')
                .map((archivo, i) => (
                  <a
                    key={i}
                    href={`${window.location.origin}/api/archivos/ver/${encodeURIComponent(archivo.relativo)}?web=1`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'block',
                      marginBottom: '8px',
                      cursor: 'pointer',
                      color: 'inherit',
                      textDecoration: 'none'
                    }}
                  >
                    <BsFileEarmark className="me-2" />
                    {archivo.nombre}
                  </a>
                ))}
            </Accordion.Body>
          </Accordion.Item>
        ))}
      </Accordion>
    </div>
  );
}

export default AdministradorDocumentos;
