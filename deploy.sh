#!/bin/bash

# 프로젝트 빌드
echo "Building project..."
npm run build

# 빌드된 파일을 Clast Cloud에 업로드
echo "Uploading files to Clast Cloud..."
# FTP 업로드 명령어 (FTP 정보는 보안을 위해 환경 변수로 설정)
lftp -u $FTP_USER,$FTP_PASSWORD $FTP_HOST << EOF
mirror -R .next public
put package.json
put package-lock.json
quit
EOF

echo "Deployment completed!" 