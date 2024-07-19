FROM mysql:5.7

COPY ./sql.cnf /etc/mysql/conf.d/sql.cnf

COPY ./init.sql /docker-entrypoint-initdb.d

ENV TZ=Asia/Tokyo