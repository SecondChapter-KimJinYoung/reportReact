#!/bin/bash

set -e

echo "=== 배포 시작 ==="

# 필요한 패키지 설치
echo "1. 필수 패키지 설치 중..."
sudo apt-get update -y
sudo apt-get install -y git curl

# Docker 설치 확인 및 설치
echo "2. Docker 설치 확인 중..."
if ! command -v docker &> /dev/null; then
    echo "Docker 설치 중..."
    sudo apt-get install -y docker.io || {
        echo "docker.io 설치 실패, 공식 저장소에서 설치 시도..."
        sudo apt-get remove -y docker docker-engine docker.io containerd runc || true
        sudo apt-get install -y ca-certificates curl gnupg lsb-release
        sudo mkdir -p /etc/apt/keyrings
        curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
        echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
        sudo apt-get update -y
        sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin
    }
else
    echo "Docker가 이미 설치되어 있습니다."
fi

# Docker 서비스 시작
echo "3. Docker 서비스 시작 중..."
sudo systemctl start docker || true
sudo systemctl enable docker || true
sudo usermod -aG docker $USER || true

# Docker Compose 설치
echo "4. Docker Compose 설치 중..."
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Git 저장소 클론 또는 업데이트
echo "5. Git 저장소 동기화 중..."
# 현재 디렉토리가 이미 reportReact인지 확인
if [ -f "docker-compose.prod.yml" ]; then
    echo "이미 저장소 디렉토리에 있습니다."
    git pull origin master || true
elif [ -d "reportReact" ]; then
    cd reportReact
    git pull origin master || true
else
    git clone https://github.com/SecondChapter-KimJinYoung/reportReact.git
    cd reportReact
fi

# 기존 컨테이너 중지 및 제거
echo "6. 기존 컨테이너 정리 중..."
sudo docker-compose -f docker-compose.prod.yml down || true

# 프로덕션 환경 변수 설정
echo "7. 프로덕션 환경 변수 설정 중..."
export PUBLIC_IP=$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4)
export VITE_API_BASE_URL=""

# 이미지 빌드 및 컨테이너 시작
echo "8. 프로덕션 빌드 및 배포 중..."
sudo docker-compose -f docker-compose.prod.yml build --no-cache
sudo docker-compose -f docker-compose.prod.yml up -d

# 상태 확인
echo "9. 배포 상태 확인 중..."
sleep 15
sudo docker-compose -f docker-compose.prod.yml ps

# 로그 확인
echo "10. 최근 로그 확인 중..."
sudo docker-compose -f docker-compose.prod.yml logs --tail=20

echo ""
echo "=== 배포 완료 ==="
echo "Frontend: http://$PUBLIC_IP"
echo "Backend API: http://$PUBLIC_IP:3000"
echo ""
echo "컨테이너 상태 확인: sudo docker-compose -f docker-compose.prod.yml ps"
echo "로그 확인: sudo docker-compose -f docker-compose.prod.yml logs -f"

