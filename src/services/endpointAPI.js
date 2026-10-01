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
        idCliente: Number(equipo.idCliente ?? equipo.idcliente ?? equipo.customerId ?? null),
        idTipo: Number(equipo.idTipo ?? equipo.tipoEquipoId ?? equipo.deviceTypeId ?? null),
        marca: equipo.marca ?? equipo.brand ?? '',
        modelo: equipo.modelo ?? equipo.model ?? '',
        numeroSerie: equipo.numeroSerie ?? equipo.serialNumber ?? '',
        contraseNa: equipo.contraseña ?? equipo.password ?? '',
        observaciones: equipo.observaciones ?? equipo.observations ?? null,
        color: equipo.color ?? null,
        imei1: equipo.imei1 ?? null,
        imei2: equipo.imei2 ?? null,
    };

    return axiosClient.post('/equipos', payload).then((response) => response.data);
};
export const updateEquipo = (idEquipo, equipo = {}) => {
    const payload = {
        idCliente: Number(equipo.idCliente ?? equipo.idcliente ?? equipo.customerId ?? null),
        idTipo: Number(equipo.idTipo ?? equipo.tipoEquipoId ?? equipo.deviceTypeId ?? null),
        marca: equipo.marca ?? equipo.brand ?? '',
        modelo: equipo.modelo ?? equipo.model ?? '',
        numeroSerie: equipo.numeroSerie ?? equipo.serialNumber ?? '',
        contrasena: equipo.contrasena ?? equipo.password ?? '',
        observaciones: equipo.observaciones ?? equipo.observations ?? null,
        color: equipo.color ?? null,
        imei1: equipo.imei1 ?? null,
        imei2: equipo.imei2 ?? null,
    };

    return axiosClient.put(`/equipos/${idEquipo}`, payload).then((response) => response.data);
};
export const getTipoEquipo = (idEquipo) => {
    return axiosClient.get(`/tipos-equipo/${idEquipo}`).then((response) => response.data);
};

export const getTiposEquipo = () => {
    return axiosClient.get('/tipos-equipo').then((response) => response.data);
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

export const getProveedores = () => {
    return axiosClient.get('/proveedores').then((response) => response.data);
}

export const createProveedor = (proveedor = {}) => {
    const payload = {
        razonSocial: proveedor.razonSocial ?? proveedor.businessName ?? '',
        nombreContacto: proveedor.nombreContacto ?? proveedor.name ?? '',
        cuit: proveedor.cuit ?? proveedor.taxId ?? '',
        telefono: proveedor.telefono ?? proveedor.phone ?? null,
        email: proveedor.email ?? null,
        direccion: proveedor.direccion ?? proveedor.address ?? null,
        localidad: proveedor.localidad ?? proveedor.city ?? null,
        observaciones: proveedor.observaciones ?? proveedor.observations ?? null,
        activo: proveedor.activo ?? true,
    };

    return axiosClient.post('/proveedores', payload).then((response) => response.data);
}

export const updateProveedor = (idProveedor, proveedor = {}) => {
    const payload = {
        razonSocial: proveedor.razonSocial ?? proveedor.businessName ?? '',
        nombreContacto: proveedor.nombreContacto ?? proveedor.name ?? '',
        cuit: proveedor.cuit ?? proveedor.taxId ?? '',
        telefono: proveedor.telefono ?? proveedor.phone ?? null,
        email: proveedor.email ?? null,
        direccion: proveedor.direccion ?? proveedor.address ?? null,
        localidad: proveedor.localidad ?? proveedor.city ?? null,
        observaciones: proveedor.observaciones ?? proveedor.observations ?? null,
        activo: proveedor.activo ?? true,
    };

    return axiosClient.put(`/proveedores/${idProveedor}`, payload).then((response) => response.data);
}