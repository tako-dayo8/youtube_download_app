FROM ubuntu:22.04

ENV TZ=Asia/Tokyo

WORKDIR /api

COPY ./node /api

RUN apt update && apt upgrade 

RUN apt-get install -y curl

# ffmpeg
RUN apt-get install -y ffmpeg

# python3
RUN apt-get install -y python3 python3-pip

RUN pip3 install --upgrade pip yt-dlp

# nodejs
RUN curl -sL https://deb.nodesource.com/setup_20.x | bash - && apt-get install -y nodejs

RUN npm install -g npm-check-updates tsx \
    && npm-check-updates -g | grep "npm -g install" | bash \
    && npm-check-updates \
    && ncu -u && npm install && npm audit fix


#　もう必要のないパッケージを削除
RUN apt-get remove -y curl 

RUN npm uninstall -g npm-check-updates

# nodeUserを作成
RUN useradd -m node

RUN chown -R node:node /api

# ユーザーを切り替える
USER node

# リリース
RUN npm run build

CMD [ "npm" , "start" ]