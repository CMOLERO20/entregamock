class ContenedorMemoria {

    constructor() {
        this.elementos = []
    }

    
    listar(id) {
        const productById = this.elementos.find(p => p.id == id);
        if (productById == undefined){
            return { error : 'producto no encontrado' }

        } else {
            return productById;
        }
        
    }

    listarAll() {
        return this.elementos;
    }

    guardar(elem) {
        if (this.elementos.length == 0){
            elem.id = 1 ;
        } else {
            const lastProd =  this.elementos[this.elementos.length - 1]
        elem.id = lastProd.id + 1;
        }
        this.elementos.push(elem);
        return elem.id
    }

    actualizar(prod, id) {
        let productoIndex = this.elementos.findIndex(p => p.id == id);
        prod.id = id
        this.elementos[productoIndex] = prod ;
        return prod
    }

    borrar(id) {
        let productoIndex = this.elementos.findIndex(p => p.id == id);
        if (productoIndex >= 0) {
           this.elementos.splice(productoIndex,1);
          }
          else {return { error : 'producto no encontrado' }}
    }

    borrarAll() {
        this.elementos = []
    }
}