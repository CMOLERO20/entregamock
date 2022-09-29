import knex from 'knex'

class ContenedorSQL {

    constructor(config, tabla) {
        this.knex = knex(config)
        this.tabla = tabla
    }

    async listar(id) {
        try {
            await this.knex.from(this.tabla).select('*').where('id', '=', id)
          } catch (error) {
            console.log('Registro no encontrado!')
          }
    }

    async listarAll() {
        try {
            const resultado = await this.knex.from(this.tabla).select('*');
            return resultado
        } catch (error) {
            return console.log('Error lectura');
        }
    }

    async guardar(elem) {
        try { 
                
             await this.knex.insert(elem).into(this.tabla); 
             console('registro guardado')
        } catch (error) {
            
        }
    }

    async actualizar(elem, id) {
        try { 
            await this.knex.from(this.tabla).where('id', '=' , id).update(elem);
            console('update ok!')
       } catch (error) {
           return console.log('Error lectura');
       }
    }



    async borrar(id) {
        try { 
            await this.knex.from(this.tabla).where('id', '=' , id).del();
            console('Registro borrado')
       } catch (error) {
           return console.log('Error lectura');
       }
    }

    async borrarAll() {
        try { 
            await this.knex.from(this.tabla).del();
            console('Registro borrado');
       } catch (error) {
           return console.log('Error lectura');
       }
    }

    async desconectar() {
     
      try { 
        await this.knex.destroy();
   } catch (error) {
       return console.log('Error lectura');
   }
    }
}

export default ContenedorSQL