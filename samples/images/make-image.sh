#!/bin/sh

SCRIPTDIR=`dirname $0`
SCRIPTBN=`basename $0`

if [ $# -eq 1 ]; then
   SIZE=$1
   POINTS=24
elif [ $# -eq 2 ]; then
   SIZE=$1
   POINTS=$2
else
   echo "ERROR: must provide either one or two parameters:"
   echo "make-image.sh <size> <fontsize>"
   echo "Example: ${SCRIPTBN} 125x125"
   echo "Example: ${SCRIPTBN} 250x250 48"
   echo "Note: 24 is the default fontsize if one is not specified"
   exit;
fi


convert -size $SIZE \
   xc:white \
   -bordercolor red \
   -border 1 \
   -pointsize $POINTS \
   -gravity center \
   -font Courier \
   -draw "text 0,0 '$SIZE'" \
   $SCRIPTDIR/img-$SIZE.jpg
