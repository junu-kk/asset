# Asset

월별 자산 트래커. 로컬 dev 환경에서 자유롭게 입력/수정하고, GitHub Pages 등 정적 호스팅에는 비공개 데이터를 암호화해 배포한다.

## 개발

```bash
pnpm install
pnpm dev          # http://localhost:5173, src/data/months.json 자동 로드
pnpm test         # vitest
pnpm build        # tsc + vite build (+ ASSET_KEY 있으면 암호화)
```

`src/data/months.json`은 gitignored — 본인 데이터는 로컬에만 있다. `pnpm dev`에서 새 기록/수정 폼은 `vite` 플러그인이 제공하는 `/api/save-months`로 파일에 직접 쓴다.

## 배포 (GitHub Pages)

1. 처음 한 번: GitHub repo Settings → Pages → Source: `gh-pages` 브랜치, root.
2. 데이터 갱신 시:

```bash
ASSET_KEY=내비밀번호 pnpm ghpages
```

`pnpm ghpages`는 다음을 한다:
1. `BASE_PATH=/<repo>/`로 vite build (sample.json 번들링됨)
2. `ASSET_KEY`로 `months.json`을 암호화해 `dist/encrypted.json` 출력
3. `gh-pages -d dist`로 `gh-pages` 브랜치에 push

배포된 사이트는:
- 기본 = sample 데이터 + "샘플 데이터" 배지
- 사이드바 "🔒 잠금 해제" → 비밀번호 모달 → 정답 시 실제 데이터 swap
- 비밀번호는 sessionStorage에 임시 저장 (탭 닫으면 사라짐)
- 편집 UI는 prod 빌드에서 비활성화 (사이드바 "+ 새 기록", 카드 수정 버튼, /edit 라우트 모두)

## git 히스토리에서 months.json 흔적 제거

지금까지 커밋된 `src/data/months.json`이 GitHub 옛 commit에 그대로 남아있다. 다음으로 삭제:

```bash
# 1. 백업
cd ..
cp -r asset asset-backup-$(date +%Y%m%d)
cd asset

# 2. git-filter-repo 설치
brew install git-filter-repo
# 또는 pip install git-filter-repo

# 3. 히스토리에서 months.json + docs/ 통째로 제거
git filter-repo \
  --path src/data/months.json \
  --path docs/ \
  --invert-paths --force

# 4. force push (단독 작업이라 안전)
git push --force origin main
```

이 작업은 모든 커밋 SHA를 바꾼다. 협업 repo면 다른 협업자에게 미리 알리고, 단독 작업이면 그냥 force push로 끝.

## 보안 모델

- 평문 데이터는 로컬 파일 시스템에만 존재 (`src/data/months.json`, gitignored)
- 배포된 자산은 AES-256-GCM으로 암호화된 `encrypted.json` (PBKDF2-SHA256, 200k iter, salt+iv 매번 새로 생성)
- 비밀번호 분실 시 복호화 불가 → 백업 권장
- URL을 알면 누구나 사이트는 볼 수 있지만 데이터는 비밀번호 없이 못 푼다 (sample만 보임)
