# EC2 배포 가이드

## 사전 준비

1. EC2 인스턴스에 SSH 접속
2. 필요한 권한 확인 (sudo 권한 필요)

## 배포 방법

### 방법 1: 배포 스크립트 사용 (권장)

```bash
# 1. 스크립트 다운로드
curl -O https://raw.githubusercontent.com/SecondChapter-KimJinYoung/reportReact/master/deploy.sh

# 2. 실행 권한 부여
chmod +x deploy.sh

# 3. 배포 실행
./deploy.sh
```

### 방법 2: 수동 배포

```bash
# 1. 필수 패키지 설치
sudo yum update -y
sudo yum install -y git docker

# 2. Docker 서비스 시작
sudo systemctl start docker
sudo systemctl enable docker
sudo usermod -aG docker ec2-user

# 3. Docker Compose 설치
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# 4. Git 저장소 클론
git clone https://github.com/SecondChapter-KimJinYoung/reportReact.git
cd reportReact

# 5. 프로덕션 배포
sudo docker-compose -f docker-compose.prod.yml build
sudo docker-compose -f docker-compose.prod.yml up -d

# 6. 상태 확인
sudo docker-compose -f docker-compose.prod.yml ps
```

## 접속 정보

- **Frontend**: http://54.153.202.151
- **Backend API**: http://54.153.202.151:3000

## 유용한 명령어

```bash
# 컨테이너 상태 확인
sudo docker-compose -f docker-compose.prod.yml ps

# 로그 확인
sudo docker-compose -f docker-compose.prod.yml logs -f

# 특정 서비스 로그만 확인
sudo docker-compose -f docker-compose.prod.yml logs -f backend
sudo docker-compose -f docker-compose.prod.yml logs -f frontend

# 컨테이너 재시작
sudo docker-compose -f docker-compose.prod.yml restart

# 컨테이너 중지
sudo docker-compose -f docker-compose.prod.yml down

# 컨테이너 재빌드 및 재시작
sudo docker-compose -f docker-compose.prod.yml up -d --build
```

## 문제 해결

### 포트가 이미 사용 중인 경우
```bash
# 포트 사용 확인
sudo netstat -tulpn | grep :80
sudo netstat -tulpn | grep :3000

# 기존 프로세스 종료
sudo kill -9 <PID>
```

### Docker 권한 문제
```bash
# ec2-user를 docker 그룹에 추가 (재로그인 필요)
sudo usermod -aG docker ec2-user
newgrp docker
```

### 빌드 실패 시
```bash
# 캐시 없이 재빌드
sudo docker-compose -f docker-compose.prod.yml build --no-cache
```

