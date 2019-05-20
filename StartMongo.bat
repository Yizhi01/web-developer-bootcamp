@echo off
cd "D:\Software\MongoDB\bin"
start mongod.exe
timeout 4
start mongo.exe
exit 