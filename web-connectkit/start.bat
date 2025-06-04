@echo off
echo 启动 Chalee DApp...
echo.

REM 设置环境变量
set GENERATE_SOURCEMAP=false
set ESLINT_NO_DEV_ERRORS=true
set TSC_COMPILE_ON_ERROR=true

REM 启动应用
npm start