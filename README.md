# Google Sheet Portfolio Dashboard

구글 시트의 데이터를 실시간으로 시각화하여 보여주는 포트폴리오 대시보드 웹 앱입니다.

## 주요 기능
- **Summary**: 총 평가금, 투자금, 수익률, 일간 변동 현황 확인
- **Charts**: 자산 비중(도넛 차트) 및 종목별 수익률(바 차트) 시각화
- **Holdings**: 상세 보유 종목 리스트 및 수익률 확인
- **Responsive**: 모바일 및 데스크탑 최적화 디자인

## 기술 스택
- React (Vite)
- Tailwind CSS
- Recharts (데이터 시각화)
- PapaParse (CSV 파싱)
- Lucide React (아이콘)

## 실행 방법

### 1. 의존성 설치
```bash
npm install --legacy-peer-deps
```

### 2. 로컬 개발 서버 실행
```bash
npm run dev
```
실행 후 터미널에 표시되는 로컬 주소(보통 `http://localhost:5173`)로 접속하여 확인할 수 있습니다.

### 3. 빌드 및 배포
```bash
# 빌드
npm run build

# GitHub Pages 배포
npm run deploy
```

## 데이터 소스
이 앱은 다음 구글 시트의 데이터를 실시간으로 가져옵니다:
[Google Sheet Link](https://docs.google.com/spreadsheets/d/1iFppGIB8RdYz0MloD2JLL8WOL8sfTSRMokaoIqYICH4/edit?usp=sharing)
