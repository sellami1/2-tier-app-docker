# database/Dockerfile
FROM mysql:8.0

ENV MYSQL_ROOT_PASSWORD=root
ENV MYSQL_DATABASE=contacts_db
# Optional: create a non-root user
ENV MYSQL_USER=kadhem
ENV MYSQL_PASSWORD=contacts123

COPY init.sql /docker-entrypoint-initdb.d/
EXPOSE 3306
