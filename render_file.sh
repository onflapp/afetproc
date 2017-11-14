#!/bin/bash

EXEC="/Applications/Adobe After Effects CC 2017/aerender"
FILE="$1"
OUT="$2"

"$EXEC" -project "$FILE" -comp composition -OMtemplate Mpeg -output "$OUT"
