
export default {
    sqlite3: {
        client: 'sqlite3',
        connection: {
            filename: `./DB/ecommerce.sqlite`
        },
        useNullAsDefault: true
    },
    mariaDb: {
        client: 'mysql',
        connection: {
            host: 'localhost',
            user: 'root',
            password: '123456',
            database: 'coderhouse'
        }
    },
    fileSystem: {
        path: './DB'
    }
}