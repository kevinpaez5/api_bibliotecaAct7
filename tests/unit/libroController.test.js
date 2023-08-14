const {
    getAllLibros,
    createLibro,
    updateLibro,
    deleteLibro,
    getLibroById,
} = require(`../../src/controllers/libroController`);

const libroModel = require(`../../src/models/libroModel`);

jest.mock('../../src/models/libroModel');

describe('Libro Controller', () => {
    let mockRes;

    beforeEach(() => {
        mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
    });

    test("getLibros debería obtener todos los libros", async () => {
        const mockLibros = [
        { id: "1", title: "Libro 1" },
        { id: "2", title: "Libro 2" },
        ];
        
    libroModel.find.mockResolvedValue(mockLibros);

    const mockReq = {};

    await getAllLibros(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith(mockLibros);
    });

    test ('getLibroById deberia obtener un libro', async() => {
        const mockLibro = { id: '1', titulo: 'Libro Encontrado', autor: 'Juan Perez'};

        libroModel.findById.mockResolvedValue(mockLibro);

        const mockReq = { params: { id: '1' } };

        await getLibroById(mockReq, mockRes);

        expect(mockRes.status).toHaveBeenCalledWith(200);
        expect(mockRes.json).toHaveBeenCalledWith(mockLibro);
    });

    test ('createLibro deberia crear un libro nuevo', async() => {
        const mockLibro = { id: '1', titulo: 'Nuevo Libro', autor: 'Juan Perez' };
        mockLibro.save = () => {};

        libroModel.create.mockResolvedValue(mockLibro);

        const mockReq = { body: mockLibro};

        await createLibro(mockReq, mockRes);

        expect(mockRes.status).toHaveBeenCalledWith(201);
        expect(mockRes.json).toHaveBeenCalledWith(mockLibro);
    });

    test ('updateLibro deberia actualizar un libro existente', async () => {
        const libroId = '1';
        const libroActualizado = { titulo: 'Libro actualizado', autor: 'Autor actualizado' };
        const libroActualizadoMock = { _id: libroId, ...libroActualizado };

        libroModel.findByIdAndUpdate.mockResolvedValue(libroActualizadoMock);

        const mockReq = { params: { id: '1'}, body: libroActualizado };

        await updateLibro(mockReq, mockRes);

        expect(libroModel.findByIdAndUpdate).toHaveBeenCalledWith(libroId, libroActualizado, { new: true });
        expect(mockRes.status).toHaveBeenCalledWith(200);
        expect(mockRes.json).toHaveBeenCalledWith(libroActualizadoMock);
    });

    test ('updateLibro deberia devolver un error si no existe el libro', async () => {
        libroModel.findByIdAndUpdate.mockResolvedValue(null);

        const mockReq = {
            params: { id: '99'},
            body: { titulo: 'Libro Actualizado' }
        }
        await updateLibro(mockReq, mockRes);

        expect(mockRes.status).toHaveBeenCalledWith(404);
        expect(mockRes.json).toHaveBeenCalledWith({ error: 'Libro no encontrado' });
    });

    test ('deleteLibro deberia eliminar un libro existente', async () => {
        const mockLibroEliminado = { titulo: 'Libro Eliminado', autor: 'Autor Eliminado' };

        libroModel.findByIdAndRemove.mockResolvedValue(mockLibroEliminado);

        const mockReq = { params: { id: '1' } };
        await deleteLibro(mockReq, mockRes);

        expect(mockRes.status).toHaveBeenCalledWith(200);
        expect(mockRes.json).toHaveBeenCalledWith(mockLibroEliminado);
    });
});