#!/bin/bash

set -e

echo "=== 배포 시작 ==="

# 필요한 패키지 설치
echo "1. 필수 패키지 설치 중..."
sudo yum update -y
sudo yum install -y git docker

# Docker 서비스 시작
echo "2. Docker 서비스 시작 중..."
sudo systemctl start docker
sudo systemctl enable docker
sudo usermod -aG docker ec2-user

# Docker Compose 설치
echo "3. Docker Compose 설치 중..."
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Git 저장소 클론 또는 업데이트
echo "4. Git 저장소 동기화 중..."
if [ -d "reportReact" ]; then
    cd reportReact
    git pull origin master
else
    git clone https://github.com/SecondChapter-KimJinYoung/reportReact.git
    cd reportReact
fi

# 기존 컨테이너 중지 및 제거
echo "5. 기존 컨테이너 정리 중..."
sudo docker-compose -f docker-compose.prod.yml down || true

# 프로덕션 환경 변수 설정
echo "6. 프로덕션 환경 변수 설정 중..."
export PUBLIC_IP=$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4)
export VITE_API_BASE_URL=""

# 이미지 빌드 및 컨테이너 시작
echo "7. 프로덕션 빌드 및 배포 중..."
sudo docker-compose -f docker-compose.prod.yml build --no-cache
sudo docker-compose -f docker-compose.prod.yml up -d

# 상태 확인
echo "8. 배포 상태 확인 중..."
sleep 15
sudo docker-compose -f docker-compose.prod.yml ps

# 로그 확인
echo "9. 최근 로그 확인 중..."
sudo docker-compose -f docker-compose.prod.yml logs --tail=20

echo ""
echo "=== 배포 완료 ==="
echo "Frontend: http://$PUBLIC_IP"
echo "Backend API: http://$PUBLIC_IP:3000"
echo ""
echo "컨테이너 상태 확인: sudo docker-compose -f docker-compose.prod.yml ps"
echo "로그 확인: sudo docker-compose -f docker-compose.prod.yml logs -f"

