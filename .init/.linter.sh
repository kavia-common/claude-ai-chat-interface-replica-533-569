#!/bin/bash
cd /home/kavia/workspace/code-generation/claude-ai-chat-interface-replica-533-569/backend
npm run lint
LINT_EXIT_CODE=$?
if [ $LINT_EXIT_CODE -ne 0 ]; then
  exit 1
fi

