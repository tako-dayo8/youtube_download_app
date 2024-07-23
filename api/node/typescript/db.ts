import mysql from 'mysql2/promise';
import log from './log.js';

class database {
    private pool: mysql.Pool;

    constructor() {
        console.log('MYSQL_HOST:', process.env.MYSQL_HOST , "\n" , 'MYSQL_USER:', process.env.MYSQL_USER , "\n" , 'MYSQL_PASSWORD:', process.env.MYSQL_PASSWORD , "\n" , 'MYSQL_DATABASE:', process.env.MYSQL_DATABASE , "\n" , 'MYSQL_TCP_PORT:', process.env.MYSQL_TCP_PORT);
        log.System("INFO","\n" + 'MYSQL_HOST:' + process.env.MYSQL_HOST + "\n" + 'MYSQL_USER:' + process.env.MYSQL_USER + "\n" + 'MYSQL_PASSWORD:' + process.env.MYSQL_PASSWORD + "\n" + 'MYSQL_DATABASE:' + process.env.MYSQL_DATABASE + "\n" + 'MYSQL_TCP_PORT:' + process.env.MYSQL_TCP_PORT);

        this.pool = mysql.createPool({
            host: process.env.MYSQL_HOST,
            user: process.env.MYSQL_USER,
            password: process.env.MYSQL_PASSWORD,
            database: process.env.MYSQL_DATABASE,
            port: Number(process.env.MYSQL_TCP_PORT) || 3306,
            waitForConnections: true,
            connectionLimit: 10,
        });
    }

    async Conect(sql: string): Promise<any> {
        const conn = await this.pool.getConnection();
        const [rows] = await conn.query(sql);
        conn.release();
        return rows;
    }
}

export default database;

// Dateオブジェクトを指定したフォーマットの文字列に変換する関数
function formatDate(date: Date) {
    var months = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
    var day = date.getDate();
    var monthIndex = date.getMonth();
    var year = date.getFullYear();
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var seconds = date.getSeconds();

    return new Date(`${year}/${months[monthIndex]}/${day}T${hours}:${minutes}:${seconds}`);
}
