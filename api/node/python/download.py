from yt_dlp import YoutubeDL
import sys

# 引数からURLを取得
url = sys.argv[1]

title = sys.argv[2]

def download(url):


    ydl_opts_video = {
        "outtmpl": "/api/videos/%(title)s.%(ext)s",
        'format': "bestvideo+bestaudio/best",
        "postprocessors": [{
            "key": "FFmpegVideoConvertor",
            "preferedformat": "mp4"
        }],
    }
    ydl_opts_audio = {
        "outtmpl": "/api/audios/" + title + ".%(ext)s",
        'format': 'bestaudio/best',
        "postprocessors": [{
            "key": "FFmpegExtractAudio",
            "preferredcodec": "mp3",
            "preferredquality": "192"
        }],
    }

    # with YoutubeDL(ydl_opts_video) as ydl:
    #     ydl.download([url])

    with YoutubeDL(ydl_opts_audio) as ydl:
        ydl.download([url])

download(url)