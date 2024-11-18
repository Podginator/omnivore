#!/bin/bash

psql --host $PG_HOST --username $POSTGRES_USER --command "CREATE DATABASE $PG_DB;" || true
echo "create $PG_DB database"

psql --host $PG_HOST --username $POSTGRES_USER --command "CREATE USER $PG_USER WITH ENCRYPTED PASSWORD '$PG_PASSWORD';" || true
echo "created app user"

psql --host $PG_HOST --username $POSTGRES_USER --command "CREATE USER $REPLICATOR_USER WITH REPLICATION ENCRYPTED PASSWORD '$REPLICATOR_PASSWORD';" || true
echo "created replicator"

psql --host $PG_HOST --username $POSTGRES_USER --command "SELECT pg_create_physical_replication_slot('$REPLICATION_SLOT_NAME');" || true
echo "created replication slot"

PG_USER=$POSTGRES_USER PG_PASSWORD=$PGPASSWORD yarn workspace @omnivore/db migrate

psql --host $PG_HOST --username $POSTGRES_USER --dbname $PG_DB --command "GRANT $DB_ROLE TO $PG_USER;" || true
echo "granted role to app user"

psql --host "$PG_HOST" --username "$POSTGRES_USER" --dbname "$PG_DB" --command "INSERT INTO omnivore.user (id, source, email, source_user_id, name, password) VALUES ('$(uuidgen)', 'EMAIL', '$OMNIVORE_EMAIL', '$OMNIVORE_EMAIL', '$OMNIVORE_USERNAME', '$OMNIVORE_PASSWORD_HASH'); INSERT INTO omnivore.user_profile (user_id, username) VALUES ((SELECT id FROM omnivore.user WHERE email='$OMNIVORE_EMAIL'), '$OMNIVORE_USERNAME');" || true
echo "created user $OMNIVORE_USERNAME"
