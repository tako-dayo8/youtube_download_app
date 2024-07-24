import fs from 'fs';
import archiver from 'archiver';

export interface DateTime {
    str: string;
    year: string;
    month: string;
    day: string;
    hour: string;
    minute: string;
    sconds: string;
}

/**
 * ログの種類を表す型です。
 *
 * - `EMERG`: システムの利用が不可能
 * - `ALERT`: アクションをすぐに起こさなければならない
 * - `CRIT`: 致命的な欠落がある状態
 * - `ERROR`: エラーが起こっている状態
 * - `WARN`: 警告されている状態
 * - `NOTICE`: 正常ではあるが重要な状態
 * - `INFO`: 情報メッセージ
 * - `DEBUG`: システムの動作に関する情報
 */
type LogType = 'EMERG' | 'ALERT' | 'CRIT' | 'ERROR' | 'WARN' | 'NOTICE' | 'INFO' | 'DEBUG';

export default class log {
    static Reqest(type: LogType, method: string, status: number, ip: string, ...message: any | any[]) {
        if (!fs.existsSync(`/api/logs`)) {
            fs.mkdirSync(`/api/logs`);
        }
        if (Array.isArray(message)) {
            // 配列の場合は空白で結合
            message = message.join(' ');
        }


        let id = 1;

        //ログ用の日付
        const date_log: DateTime = getDateTime();
        const log_file_path = `/api/logs/reqest.log`;

        try {
            const file = fs.readFileSync(log_file_path, 'utf-8');
            id = file.split('\n').length;
        } catch (e) {
            id = 1;
        }

        const log = `${date_log.str} [${type}] #${id} [Method: ${method}] [Status: ${status}] [IP: ${ip}] ${message}\n`;

        try {
            fs.appendFileSync(log_file_path, log, 'utf-8');
        } catch (error) {
            fs.writeFileSync(log_file_path, log, 'utf-8');
        }
    }

    static System(type: LogType, ...message: any | any[]) {
        if (!fs.existsSync(`/api/logs`)) {
            fs.mkdirSync(`/api/logs`);
        }
        if (Array.isArray(message)) {
            // 配列の場合は空白で結合
            message = message.join(' ');
        }


        let id = 1;

        //ログ用の日付
        const date_log: DateTime = getDateTime();
        const log_file_path = `/api/logs/system.log`;

        try {
            const file = fs.readFileSync(log_file_path, 'utf-8');
            id = file.split('\n').length;
        } catch (e) {
            id = 1;
        }

        const log = `${date_log.str} [${type}] #${id} ${message}\n`;

        try {
            fs.appendFileSync(log_file_path, log, 'utf-8');
        } catch (error) {
            fs.writeFileSync(log_file_path, log, 'utf-8');
        }
    }

    static Tarminal(type: LogType, ...message: any | any[]) {
        if (!fs.existsSync(`/api/logs`)) {
            fs.mkdirSync(`/api/logs`);
        }
        if (Array.isArray(message)) {
            // 配列の場合は空白で結合
            message = message.join(' ');
        }

        const putMessage = `[${getDateTime().str}] [${type}] ` +  message;

        switch (type) {
            case 'EMERG':
                console.error(putMessage);
                break;
            case 'ALERT':
                console.error(putMessage);
                break;
            case 'CRIT':
                console.error(putMessage);
                break;
            case 'ERROR':
                console.error(putMessage);
                break;
            case 'WARN':
                console.warn(putMessage);
                break;
            case 'NOTICE':
                console.log(putMessage);
                break;
            case 'INFO':
                //文字列に%が含まれている場合は、上書き出力を行う
                if (putMessage.includes('%') && !putMessage.includes('100%')) {
                    //カーソルを一番右に移動
                    process.stdout.write('\r');
                    process.stdout.write(putMessage);
                    return;
                } else {
                    console.log(putMessage);
                }
                break;
            case 'DEBUG':
                console.debug(putMessage);
                break;
            default:
                console.log(putMessage);
                break;
        }

        const file_path = `/api/logs/tarminal.log`;
        const log = putMessage + '\n';

        try {
            fs.appendFileSync(file_path, log, 'utf-8');
        } catch (error) {
            fs.writeFileSync(file_path, log, 'utf-8');
        }
    }
}

export function getDateTime(): DateTime {
    //現在の日付を取得
    const date = new Date();
    const year = date.getFullYear().toString();
    const month = date.getMonth() + 1 > 9 ? (date.getMonth() + 1).toString() : '0' + (date.getMonth() + 1);
    const day = date.getDate() > 9 ? date.getDate().toString() : '0' + date.getDate();
    const hour = date.getHours() > 9 ? date.getHours().toString() : '0' + date.getHours();
    const minute = date.getMinutes() > 9 ? date.getMinutes().toString() : '0' + date.getMinutes();
    const sconds = date.getSeconds() > 9 ? date.getSeconds().toString() : '0' + date.getSeconds();

    //ログ用の日付
    return {
        str: `${year}/${month}/${day} ${hour}:${minute}:${sconds}`,
        year: year,
        month: month,
        day: day,
        hour: hour,
        minute: minute,
        sconds: sconds,
    };
}

export async function LogZip() {
    if (!fs.existsSync(`/api/logs_old`)) {
        fs.mkdirSync(`/api/logs_old`);
    }

    const date = getDateTime();
    const today = `${date.year}-${date.month}-${date.day}`;

    const zipPath = `/api/logs_old/${today}.zip`;
    const output = fs.createWriteStream(zipPath);

    const archive = archiver('zip', { zlib: { level: 9 } });

    archive.pipe(output);
    archive.glob('**/*', {
        cwd: `/api/logs/`, // ルートディレクトリを指定
    });

    await archive.finalize();

    output.on('close', function () {
        // zip圧縮完了すると発火する
        const archive_size = archive.pointer();
        console.log(`complete! logs total size : ${archive_size} bytes`);
        fs.readdirSync(`/api/logs/`).forEach((file) => {
            fs.rmSync(`/api/logs/${file}`, { recursive: true, force: true });
        });
    });
}
