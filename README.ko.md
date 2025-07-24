# Capture Robot

**[English](README.md) | 한국어**

스크린샷 캡처 자동화 CLI 도구

## 설치 및 실행

```shell
$ npx capture-robot [command]
```

전역 설치:

```shell
$ npm install -g capture-robot
$ capture-robot [command]
```

## 사용법

### 도움말

```shell
$ capture-robot --help
$ capture-robot start --help
```

### 모니터 목록 확인

```shell
$ capture-robot monitors

Available monitors:
  [ID: 2] Monitor #30544
```

### 자동 캡처

**간단한 예시:**

```shell
$ capture-robot start -c 5 -d 3000
```

**전체 옵션:**

```shell
$ capture-robot start \
    --count 10 \
    --delay 5000 \
    --monitor 2 \
    --interval 500 \
    --key enter \
    --output /tmp/screenshots \
    --overwrite
```

**옵션 설명:**

- `--count 10`: 10번 캡처
- `--delay 5000`: 시작 전 5초(5000ms) 대기
- `--monitor 2`: 모니터 ID 2번 사용 (ID는 `monitors` 명령어로 확인)
- `--interval 500`: 캡처 간격 0.5초(500ms)
- `--key enter`: 매 캡처 후 Enter 키 입력
- `--output /tmp/screenshots`: 저장 디렉터리 지정
- `--overwrite`: 기존 파일 덮어쓰기 허용

## 라이선스

MIT License
