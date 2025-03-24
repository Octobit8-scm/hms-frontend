#!/bin/bash

# Configuration
BACKUP_DIR="/backups"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
DB_NAME="hospital_db"
DB_USER="postgres"
DB_HOST="db"
DB_PORT="5432"
ENCRYPTION_KEY="/backups/encryption.key"
EMAIL_TO="admin@hospital.com"
EMAIL_FROM="backup@hospital.com"
RETENTION_DAYS=7
LOG_FILE="/var/log/backup.log"

# Create backup directory if it doesn't exist
mkdir -p $BACKUP_DIR

# Create backup filename
BACKUP_FILE="$BACKUP_DIR/backup_$TIMESTAMP.sql"
ENCRYPTED_BACKUP="$BACKUP_FILE.gpg"

# Log function
log() {
    echo "$(date '+%Y-%m-%d %H:%M:%S') - $1" | tee -a $LOG_FILE
}

# Send email function
send_email() {
    subject=$1
    body=$2
    echo "$body" | mail -s "$subject" -r "$EMAIL_FROM" "$EMAIL_TO"
}

# Generate encryption key if it doesn't exist
if [ ! -f "$ENCRYPTION_KEY" ]; then
    log "Generating new encryption key..."
    gpg --gen-key --batch << EOF
Key-Type: RSA
Key-Length: 2048
Name-Real: Hospital Backup
Name-Email: backup@hospital.com
Expire-Date: 0
%no-protection
%commit
EOF
fi

# Perform the backup
log "Starting database backup..."
pg_dump -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME > $BACKUP_FILE

# Check if backup was successful
if [ $? -eq 0 ]; then
    log "Backup completed successfully: $BACKUP_FILE"
    
    # Verify backup integrity
    log "Verifying backup integrity..."
    if pg_restore -l $BACKUP_FILE > /dev/null 2>&1; then
        log "Backup verification successful"
    else
        log "Backup verification failed!"
        send_email "Backup Verification Failed" "The backup created at $TIMESTAMP failed verification."
        exit 1
    fi
    
    # Encrypt the backup
    log "Encrypting backup..."
    gpg --encrypt --recipient backup@hospital.com $BACKUP_FILE
    if [ $? -eq 0 ]; then
        log "Backup encrypted successfully"
        rm $BACKUP_FILE  # Remove unencrypted backup
    else
        log "Backup encryption failed!"
        send_email "Backup Encryption Failed" "The backup created at $TIMESTAMP failed encryption."
        exit 1
    fi
    
    # Compress the encrypted backup
    log "Compressing backup..."
    gzip $ENCRYPTED_BACKUP
    if [ $? -eq 0 ]; then
        log "Backup compressed successfully"
    else
        log "Backup compression failed!"
        send_email "Backup Compression Failed" "The backup created at $TIMESTAMP failed compression."
        exit 1
    fi
    
    # Delete old backups
    log "Cleaning up old backups..."
    find $BACKUP_DIR -name "backup_*.sql.gz.gpg" -mtime +$RETENTION_DAYS -delete
    log "Deleted backups older than $RETENTION_DAYS days"
    
    # Send success notification
    send_email "Backup Successful" "Database backup completed successfully at $TIMESTAMP"
else
    log "Backup failed!"
    send_email "Backup Failed" "Database backup failed at $TIMESTAMP"
    exit 1
fi 