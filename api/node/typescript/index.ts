import ytdl from 'ytdl-core';
import fs from 'fs';
import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import cors from 'cors';
import log, { getDateTime } from './log.js';
import { spawn } from 'child_process';
import database from './db.js';

const port: number = 4000; //ポート番号
//初期化
const app = express();

app.use(cors());

//jsonをuse
app.use(express.json());

const db = new database();

app.use('/', (req: Request, res: Response, next: NextFunction) => {
    if (req.method != 'GET') {
        next();
        return;
    }

    if (!(req.url == '/' || req.url.startsWith('/audios') || req.url.startsWith('/videos'))) {
        log.Tarminal('INFO', '-----------------GET-----------------');

        res.status(404).json({ status: 404, error: 'No Root found' });
        log.Tarminal('ERROR', 'status : 404 No Root found');
        log.Reqest('ERROR', req.method, 404, req.socket.remoteAddress || 'Failed to Get IP', 'No Root found');

        log.Tarminal('INFO', '-------------------------------------');
    } else {
        next();
        return;
    }
});

// Hello world
app.get('/', (req: Request, res: Response) => {
    log.Tarminal('INFO', '-----------------GET-----------------');

    res.status(200).json({ status: 200, message: 'Hello world' });
    log.Tarminal('INFO', 'status : 200 success');
    log.Reqest('INFO', req.method, 200, req.socket.remoteAddress || 'Failed to Get IP', "'/' request success return 'Hello world'");

    log.Tarminal('INFO', '-------------------------------------');
});

// Get audios
app.use('/audios', (req: Request, res: Response, next: NextFunction) => {
    if (req.method != 'GET') {
        log.Tarminal('INFO', '-----------------POST-----------------');

        res.status(404).json({ status: 404, error: 'No Root found' });
        log.Tarminal('ERROR', 'status : 404 No Root found');
        log.Reqest('ERROR', req.method, 404, req.socket.remoteAddress || 'Failed to Get IP', 'No Root found');

        log.Tarminal('INFO', '-------------------------------------');
    }

    log.Tarminal('INFO', '-----------------GET-----------------');

    //ipを取得
    const ip: string = req.socket.remoteAddress || 'Failed to Get IP';

    //ここでurlを取得して、そのurlのファイルを返す
    const url: string = decodeURIComponent(req.url);
    const file_name = url.replace('/', '');

    log.Tarminal('INFO', `reqest url : ${url}`);

    if (url == '/') {
        res.status(404).json({ status: 404, error: 'No file found' });
        log.Reqest('ERROR', req.method, 404, ip, 'No file found' + `url : ${url}`);
        log.Tarminal('ERROR', 'status : 404 No file found');

        log.Tarminal('INFO', '-------------------------------------');
        return;
    }

    //フォルダがない場合404を返す
    if (!fs.existsSync(`./audios`)) {
        res.status(404).json({ status: 404, error: 'No Directory found' });
        log.Reqest('ERROR', req.method, 404, ip, 'No Directory found' + `url : ${url}`);
        log.Tarminal('ERROR', 'status : 404 No Directory found');

        log.Tarminal('INFO', '-------------------------------------');
        return;
    }

    const resalt = fs.readdirSync('./audios').filter((file) => {
        return file.includes(file_name);
    });

    //ファイルが存在しない場合404を返す
    if (resalt.length == 0) {
        res.status(404).json({ status: 404, error: 'No file found' });
        log.Reqest('ERROR', req.method, 404, ip, 'No file found' + `url : ${url}`);
        log.Tarminal('ERROR', 'status : 404 No file found');

        log.Tarminal('INFO', '-------------------------------------');
        return;
    }
    const file_path = path.join('./audios', file_name);

    //ファイルを返す
    res.download(file_path);
    log.Tarminal('INFO', 'status : 200 success ' + `rqeuestIP : ${ip}`);
    log.Reqest('INFO', req.method, 200, ip, 'success' + `url : ${url}`);

    log.Tarminal('INFO', '-------------------------------------');
});

//保存先url
const audio_url = process.env.NODE_ENV == 'production' ? ' https://api.mcakh-studio.site/audios/' : 'http://localhost:4000/audios/';

app.post('/', async (req: Request, res: Response) => {
    log.Tarminal('INFO', '-----------------POST-----------------');

    const ip: string = req.socket.remoteAddress || 'Failed to Get IP';

    //アクセスIPを表示
    log.Tarminal('INFO', `Access IP: ${ip}`);

    //送られたURLを取得
    const req_url: string = req.body.url;

    //urlがundefinedの場合失敗リクエストを返す
    if (req_url == undefined) {
        res.status(400).json({ status: 400, error: 'url or quality is undefined' });
        log.Reqest('ERROR', req.method, 400, ip, 'url or quality undefined');
        log.Tarminal('ERROR', 'status : 400 url or quality undefined');
        log.Tarminal('INFO', '-------------------------------------');
        return;
        //有効なビデオ ID を解析できるかどうかを確認
    } else if (!ytdl.validateURL(req_url)) {
        res.status(400).json({ status: 400, error: 'url is invalid' });
        log.Reqest('ERROR', req.method, 400, ip, 'url is invalid' + `url : ${req_url}`);
        log.Tarminal('ERROR', 'status : 400 url is invalid');
        log.Tarminal('INFO', '-------------------------------------');
        return;
    }

    //送られたURLを表示logに表示
    log.Tarminal('INFO', `Reqest Youtube URL : ${req_url}`);
    //log.Tarminal("INFO",`Reqest Quality : ${req_quality}`)

    let video_id: string;

    //IDを取得
    try {
        video_id = ytdl.getURLVideoID(req_url);
    } catch (e: any) {
        res.status(500).json({ status: 500, error: 'failure Get VideoID from url' });
        log.Reqest('ERROR', req.method, 500, ip, 'failure Get VideoID from url' + `url : ${req_url}`);
        log.Tarminal('ERROR', 'status : 500 failure Get VideoID from url');
        log.Tarminal('INFO', '-------------------------------------');
        return;
    }

    //IDを表示logに表示
    log.Tarminal('INFO', `Video ID : ${video_id}`);

    //動画の詳細情報を取得
    const video_info = await ytdl.getBasicInfo(req_url, { lang: 'ja' });

    const video_title = video_info.videoDetails.title.replace('/', '-').replace(/\s+/g, '');

    //動画の詳細情報を表示
    log.Tarminal('INFO', `Video Title : ${video_title}`);

    //音声の保存先がない場合作成
    if (!fs.existsSync('./audios')) {
        fs.mkdirSync('./audios');
    }

    const url_save_audio = `${audio_url}${video_title}.mp3`;

    const res_data = {
        status: 200,
        video_id: video_id,
        yt_url: req_url,
        title: video_title,
        url: {
            audio: url_save_audio,
        },
        date: getDateTime().str,
    };

    //同じIDのファイルが存在する場合削除
    await removeFile(video_title);

    let time_count = 0;

    const interval = setInterval(() => {
        time_count++;
    }, 1);

    log.Tarminal('INFO', `-----------------Python-----------------`);
    const run = spawn('/bin/python3', ['/api/python/download.py', req_url, video_title]);

    run.stdout.on('data', (data) => {
        log.Tarminal('INFO', `${data.toString().replace(/\n/g, '')}`);
    });

    run.stderr.on('data', (data) => {
        log.Tarminal('ERROR', `${data}`);
    });

    //完了まで待機
    run.on('close', async (code) => {
        log.Tarminal('INFO', `code : ${code}`);
        log.Tarminal('INFO', `----------------------------------------`);

        log.Tarminal('INFO', `Download Time : ${time_count}ms`);

        clearInterval(interval);

        if (code != 0) {
            res.status(500).json({ status: 500, error: 'failure download video' });
            log.Reqest('ERROR', req.method, 500, ip, 'failure download video' + `url : ${req_url}`);
            log.Tarminal('ERROR', 'status : 500 failure download video');
            log.Tarminal('INFO', '-------------------------------------');
            return;
        }

        const now = new Date();
        log.Tarminal('INFO', `現在の時間: ${toMysqlFormat(now)}`);

        // 10時間後の時間を取得
        const tenHoursLater = new Date(now.getTime() + 10 * 60 * 60 * 1000);
        log.Tarminal('INFO', `削除時間: ${toMysqlFormat(tenHoursLater)}`);

        // ダウンロードした動画情報をdatabeseに保存
        await db.Conect(`INSERT INTO files (name , existences) VALUES ('${video_title}' , ${true})`);
        // ダウンロードした時間情報をdatabeseに保存
        await db.Conect(`INSERT INTO times (download_at , remove_at) VALUES ('${toMysqlFormat(now)}' , '${toMysqlFormat(tenHoursLater)}')`);

        //成功レスポンス
        res.status(200).json(res_data);
        log.Reqest('INFO', req.method, 200, ip, 'success' + `url : ${req_url} , id : ${video_id} , title : ${video_title}, save_audio : ${url_save_audio}`);
        log.Tarminal('INFO', 'status : 200 success');
        log.Tarminal('INFO', '-------------------------------------');
        return;
    });
});

app.listen(port, () => {
    log.Tarminal('INFO', `Server is running on port ${port}`);
    log.System('INFO', `Server is running on port ${port}`);
});

async function removeFile(title: string): Promise<void> {
    let removed = false;

    fs.readdirSync('./audios').forEach(async (file) => {
        if (file.includes(title)) {
            fs.unlinkSync(`./audios/${file}`);
            log.Tarminal('INFO', 'removed audio file : ' + file);
            const ald_data = await db.Conect(`SELECT * FROM files WHERE name = '${title}'`);
            if (ald_data.length != 0) {
                await db.Conect(`UPDATE files SET existences = ${false} WHERE name = '${title}'`);
            }
            removed = true;
        }
    });
}

function toMysqlFormat(date: Date): string {
    return date.getFullYear() + '-' + ('0' + (date.getMonth() + 1)).slice(-2) + '-' + ('0' + date.getDate()).slice(-2) + ' ' + ('0' + date.getHours()).slice(-2) + ':' + ('0' + date.getMinutes()).slice(-2) + ':' + ('0' + date.getSeconds()).slice(-2);
}
