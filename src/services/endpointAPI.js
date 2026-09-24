import axiosClient from './axiosclient';

export const getClientes = () => {
    return axiosClient.get('/clientes').then((response) => response.data);
}

export const createCliente = (cliente = {}) => {
    const payload = {
        nombre: cliente.nombre ?? cliente.firstName ?? '',
        apellido: cliente.apellido ?? cliente.lastName ?? '',
        telefono: cliente.telefono ?? cliente.phone ?? null,
        redSocial: cliente.redSocial ?? cliente.socialNetwork ?? null,
        observaciones: cliente.observaciones ?? cliente.observations ?? null,
    };

    return axiosClient.post('/clientes', payload).then((response) => response.data);
};

export const updateCliente = (idCliente, cliente = {}) => {
    const payload = {
        nombre: cliente.nombre ?? cliente.firstName ?? '',
        apellido: cliente.apellido ?? cliente.lastName ?? '',
        telefono: cliente.telefono ?? cliente.phone ?? null,
        redSocial: cliente.redSocial ?? cliente.socialNetwork ?? null,
        observaciones: cliente.observaciones ?? cliente.observations ?? null,
    };

    return axiosClient.put(`/clientes/${idCliente}`, payload).then((response) => response.data);
};

export const getProductos = () => {
    return axiosClient.get('/productos').then((response) => response.data);
}

export const createProducto = (producto = {}) => {
    const payload = {
        nombre: producto.nombre ?? producto.name ?? '',
        codigo: producto.codigo ?? producto.sku ?? '',
        descripcion: producto.descripcion ?? null,
        categoriaId: Number(producto.categoriaId ?? producto.categoryId ?? null),
        marca: producto.marca ?? producto.brand ?? '',
        modelo: producto.modelo ?? producto.model ?? '',
        stockminimo: Number(producto.stockminimo ?? producto.minStock ?? producto.min ?? 0),
        precioCosto: Number(producto.precioCosto ?? producto.cost ?? 0),
        precioVenta: Number(producto.precioVenta ?? producto.price ?? 0),
        activo: producto.activo ?? true,
        codigoBarras: producto.codigoBarras ?? producto.barcode ?? null,
        unidadMedida: producto.unidadMedida ?? producto.unitMeasure ?? null,
    };

    return axiosClient.post('/productos', payload).then((response) => response.data);
};

export const updateProducto = (idProducto, producto = {}) => {
    const payload = {
        nombre: producto.nombre ?? producto.name ?? '',
        codigo: producto.codigo ?? producto.sku ?? '',
        descripcion: producto.descripcion ?? null,
        categoriaId: Number(producto.categoriaId ?? producto.categoryId ?? null),
        marca: producto.marca ?? producto.brand ?? '',
        modelo: producto.modelo ?? producto.model ?? '',
        stockminimo: Number(producto.stockminimo ?? producto.minStock ?? producto.min ?? 0),
        precioCosto: Number(producto.precioCosto ?? producto.cost ?? 0),
        precioVenta: Number(producto.precioVenta ?? producto.price ?? 0),
        activo: producto.activo ?? true,
        codigoBarras: producto.codigoBarras ?? producto.barcode ?? null,
        unidadMedida: producto.unidadMedida ?? producto.unitMeasure ?? null,
    };

    return axiosClient.put(`/productos/${idProducto}`, payload).then((response) => response.data);
};

export const updateVenta = (idVenta, venta = {}) => {
    const payload = {
        articulo: venta.articulo ?? venta.item ?? venta.sale ?? '',
        cantidad: Number(venta.cantidad ?? venta.quantity ?? 0),
        precioUnitario: Number(venta.precioUnitario ?? venta.unitPrice ?? 0),
        montoTotal: Number(venta.montoTotal ?? venta.total ?? 0),
    };

    return axiosClient.put(`/ventas/${idVenta}`, payload).then((response) => response.data);
};

export const getOrdenes = () => {
    return axiosClient.get('/ordenes-reparacion').then((response) => response.data);
}

export const updateOrden = (idOrden, orden = {}) => {
    const payload = {
        codigoOrden: orden.codigoOrden ?? orden.orderCode ?? '',
        cliente: orden.cliente ?? orden.customer ?? '',
        fechaIngreso: orden.fechaIngreso ?? orden.entryDate ?? null,
        presupuestoInicial: Number(orden.presupuestoInicial ?? orden.initialBudget ?? 0),
        equipo: orden.equipo ?? orden.device ?? '',
        fallaReportada: orden.fallaReportada ?? orden.issue ?? '',
        estado: orden.estado ?? orden.status ?? '',
    };

    return axiosClient.put(`/ordenes/${idOrden}`, payload).then((response) => response.data);
};

export const getEquipos = () => {
    return axiosClient.get('/equipos').then((response) => response.data);
}

export const createEquipo = (equipo = {}) => {
    const payload = {
        nombre: equipo.nombre ?? equipo.name ?? '',
        descripcion: equipo.descripcion ?? null,
        activo: equipo.activo ?? true,
    };

export const updateEquipo = (idEquipo, equipo = {}) => {
        const payload = {
            nombre: equipo.nombre ?? equipo.name ?? '',
            descripcion: equipo.descripcion ?? null,
            activo: equipo.activo ?? true,
        };

export const getTipoEquipo = (idEquipo, equipo = {}) => {
    return axiosClient.get(`/tipos-equipo/${idEquipo}`).then((response) => response.data);
};
    
export const createTipoEquipo = (tipoEquipo = {}) => {
    const payload = {
        nombre: tipoEquipo.nombre ?? tipoEquipo.name ?? '',
    };
    return axiosClient.post('/tipos-equipo', payload).then((response) => response.data);
};

export const updateTipoEquipo = (idTipoEquipo, tipoEquipo = {}) => {
    const payload = {
        nombre: tipoEquipo.nombre ?? tipoEquipo.name ?? '',
    };

    return axiosClient.put(`/tipos-equipo/${idTipoEquipo}`, payload).then((response) => response.data);
};

export const getCategorias = () => {
    return axiosClient.get('/categorias-producto').then((response) => response.data);
};

export const createCategoria = (categoria = {}) => {
    const payload = {
        nombre: categoria.nombre ?? '',
        descripcion: categoria.descripcion ?? null,
        activo: categoria.activo ?? true,
    };

    return axiosClient.post('/categorias-producto', payload).then((response) => response.data);
};


export const updateCategoria = (idCatProducto, categoria = {}) => {
    const payload = {
        nombre: categoria.nombre ?? null,
        descripcion: categoria.descripcion ?? null,
        activo: categoria.activo ?? null,
    };

    return axiosClient.put(`/categorias-producto/${idCatProducto}`, payload).then((response) => response.data);
};

export const getEstados = () => {
    return axiosClient.get('/estados-orden').then((response) => response.data);
};

export const createEstado = (estado = {}) => {
    const payload = {
        nombre: estado.nombre ?? '',
        descripcion: estado.descripcion ?? null,
        color: estado.color ?? null,
        orden: estado.orden ?? null,
        activo: estado.activo ?? true,
    };

    return axiosClient.post('/estados-orden', payload).then((response) => response.data);
};


export const updateEstado = (idEstado, estado = {}) => {
    const payload = {
        nombre: estado.nombre ?? null,
        descripcion: estado.descripcion ?? null,
        color: estado.color ?? null,
        orden: estado.orden ?? null,
        activo: estado.activo ?? null,
    };

    return axiosClient.put(`/estados-orden/${idEstado}`, payload).then((response) => response.data);
};


