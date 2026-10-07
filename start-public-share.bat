@echo off
title Code Playground - Public Cloud Tunnel
color 0A
echo ======================================================================
echo    CODE PLAYGROUND - PUBLIC CLOUD TUNNEL (ALL NETWORKS / 4G / 5G)
echo ======================================================================
echo.
echo Starting secure HTTPS tunnel for port 5501...
echo Anyone anywhere in the world will be able to scan and open your links!
echo.
echo Press Ctrl+C anytime to stop.
echo ======================================================================
echo.
.\cloudflared.exe tunnel --url http://localhost:5501
pause
