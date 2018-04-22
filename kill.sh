#!/bin/bash
WHITE='\033[1;37m'
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "\n${WHITE}--- TERMINATING SERVERS ---${NC}"
echo -e "${GREEN}✓ backend process PID: ${PT_BACKEND_PROCESS}${NC}"
echo -e "${GREEN}✓ frontend process PID: ${PT_FRONTEND_PROCESS}${NC}"

kill -9 ${PT_BACKEND_PROCESS}
kill -9 ${PT_FRONTEND_PROCESS}

echo -e "${RED}✗ backend process PID: ${PT_BACKEND_PROCESS}${NC}"
echo -e "${RED}✗ frontend process PID: ${PT_FRONTEND_PROCESS}${NC}"
