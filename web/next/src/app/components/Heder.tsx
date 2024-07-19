import React from 'react';
import styles from '../styles/Heder.module.css';
import Image from 'next/image';
import Link from 'next/link';

const Heder = (): JSX.Element => {
    return (
        <div className={`${styles.heder} flex bg-[#000000] w-full`}>
            <div className={styles.title}>
                <Image className={styles.title_img} src="/snail.png" alt="logo" width={50} height={50} />
                <Link href="/" className={styles.title_a}>
                    <h1>
                        <span className={styles.title_a_span}>YouTube</span> Downloader
                    </h1>
                </Link>
            </div>
            <div className={styles.nav}>
                <Link href="/" className={styles.nav_a}>
                    <p>API</p>
                </Link>
                <Link href="https://github.com/tako-dayo8/youtube_download_api" target="_blank" rel="noopener" className={styles.nav_a}>
                    <p>GitHub</p>
                </Link>
            </div>
            <div className={styles.responsive_nav}>
                <input type="checkbox" id="check" className={styles.check} style={{ display: 'none' }} />
                <label htmlFor="check" className={styles.button}>
                    <span className={styles.navicon}></span>
                </label>
                <ul className={styles.nav_ul}>
                    <li>
                        <Link href="/" className={styles.nav_ul_a}>
                            API
                        </Link>
                    </li>
                    <li>
                        <Link href="https://github.com/tako-dayo8/youtube_download_api" target="_blank" rel="noopener" className={styles.nav_ul_a}>
                            GitHub
                        </Link>
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default Heder;
