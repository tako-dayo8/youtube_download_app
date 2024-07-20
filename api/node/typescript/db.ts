import mysql from "mysql2/promise"

class database {
    private pool : mysql.Pool

    constructor() {
        this.pool = mysql.createPool({
            host: "db",
            user: process.env.MYSQL_USER,
            password: process.env.MYSQL_PASSWORD,
            database: process.env.MYSQL_DATABASE,
            port : Number(process.env.MYSQL_TCP_PORT) || 6000,
            waitForConnections: true,
            connectionLimit: 10,
        })
    }

    async Conect(sql: string) : Promise<any> {
        const conn = await this.pool.getConnection()
        const [rows]  = await conn.query(
            sql
        )
        conn.release()
        return rows
    }

}

export default database;

// Dateオブジェクトを指定したフォーマットの文字列に変換する関数
function formatDate(date : Date) {
    var months = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
    var day = date.getDate();
    var monthIndex = date.getMonth();
    var year = date.getFullYear();
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var seconds = date.getSeconds();

    return new Date(`${year}/${months[monthIndex]}/${day}T${hours}:${minutes}:${seconds}`);
}
