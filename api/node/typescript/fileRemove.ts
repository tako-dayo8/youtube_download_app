import fs from 'fs';
import path from 'path';
import database from './db.js';
import log from './log.js';

//このファイルはサーバーで1時間ごとに実行される

//定期的にファイルを削除する

//削除するファイルの保存先
const audio_path = './audios';

const db = new database();

interface getData {
    name: string;
    download_at: Date;
    remove_at: Date;
}

try {
    const removes = (await db.Conect('SELECT f.name, t.download_at, t.remove_at FROM files f INNER JOIN times t ON f.id = t.id WHERE f.existences = TRUE AND NOW() > t.remove_at;')) as getData[];

    log.System('INFO', `削除する項目 : ${removes.map((remove, index) => remove.name + (index === removes.length - 1 ? '' : ','))}`);

    removes.forEach(async (remove: getData) => {
        const file_path = path.join(audio_path, remove.name, '.mp3');
        fs.unlinkSync(file_path);
        try {
            await db.Conect(`UPDATE files SET existences = FALSE WHERE name = ${remove.name}`);
        } catch (e: any) {
            log.System('ERROR', e);
            log.Tarminal('ERROR', e);
            return;
        }
        log.System('INFO', `ファイル${remove.name}.mp3を削除しました`);
    });
} catch (e: any) {
    log.System('ERROR', e);
}
