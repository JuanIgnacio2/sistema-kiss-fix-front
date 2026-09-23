import axiosClient from './axiosclient';

export const getClientes = () => {
    return axiosClient.get('/clientes').then((response) => response.data);
}

export const createCliente = (cliente) => {
    return axiosClient.post('/clientes', {
        nombre: cliente.nombre,
        apellido: cliente.apellido,
        telefono: cliente.telefono || null,
        redSocial: cliente.redSocial || null,
        observaciones: cliente.observaciones || null,
    }).then((response) => response.data);
};