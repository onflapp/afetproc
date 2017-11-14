#!/bin/bash
RV_FILE="/tmp/ae_process.txt"
FILE="$1"
CFG="$2"

rm $RV_FILE 2>/dev/null

osascript <<END
tell application "Adobe After Effects CC 2017"
	set src to read POSIX file "/Users/oflorian/Projects/DAY/CreativeCastProcessor/process.jsx" as «class utf8»
    set src to src & "\n" & "replacePlaceholders(\\"$FILE\\", \\"$CFG\\");"
	DoScript src
end tell
get ""
END

cat $RV_FILE 2>/dev/null
