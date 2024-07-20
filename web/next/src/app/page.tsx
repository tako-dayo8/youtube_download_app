'use client';
import React, { useRef, useState } from 'react';
import Heder from './components/Heder';
import Link from 'next/link';
import Image from 'next/image';
import './styles/globals.css';
import styles from './styles/MainHome.module.css';

export default function Home(): JSX.Element {
    const ref = useRef<HTMLInputElement>(null);
    const [Input, setInput] = useState(true as boolean);
    const [isLoading, setIsLoading] = useState(false as boolean);
    const [URL_MP4, setURL_MP4] = useState('' as string);
    const [URL_MP3, setURL_MP3] = useState('' as string);

    const getDwoloadURL = async () => {
        console.log(ref.current?.value);
        if (ref.current?.value === '' || ref.current?.value === undefined) {
            alert('URLを入力してください');
            return;
        } else {
            const url = process.env.NODE_ENV == 'production' ? ' https://api.mcakh-studio.site' : 'http://localhost:4000';
            const requestBody = JSON.stringify({ url: ref.current.value });

            setIsLoading(true);

            const res = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: requestBody,
                cache: 'no-cache',
            });

            const data = await res.json();

            setIsLoading(false);

            if (data.status !== 200) {
                alert('取得に失敗しました。URLを確認してください。');
                return;
            } else {
                console.log(data);
                setURL_MP3(data.url.audio);
                setURL_MP4(data.url.video);

                setInput(false);
            }
        }
    };

    const CopyElement_MP3 = async () => {
        await navigator.clipboard.writeText(URL_MP3);
        alert('コピーしました');
    };

    const InputForm = () => {
        if (Input) {
            return (
                <>
                    <input className={styles.Text_Box} type='text' placeholder='Input YouTube URL...' ref={ref} />
                    <button className={styles.Button} onClick={getDwoloadURL}>
                        make download url
                    </button>
                </>
            );
        } else {
            return (
                <>
                    <h2 className={styles.res_Title}>MP3</h2>
                    <div className={styles.ress}>
                        <Link href={URL_MP3} id='MP3'>
                            <p className={`${styles.res_P} bg-[yellow]`}>click to download MP3</p>
                        </Link>
                        <Image src='/copyIcon.png' alt='copy' width={55} height={55} onClick={CopyElement_MP3} />
                    </div>
                    <Link href='/' className={styles.backButton} onClick={() => setInput(true)}>
                        Back
                    </Link>
                </>
            );
        }
    };

    return (
        <>
            <Heder />
            <main className='flex items-center flex-col h-full mt-[70px]' style={{ color: 'black' }}>
                {isLoading ? <p>Loading...</p> : <InputForm />}
            </main>
        </>
    );
}
