#!/bin/bash

SRC_ROOT=".."
TMP_DIR=/tmp/pimp_deb_`date +%Y%m%d%H%M%S`

# creating temporary workspace
mkdir $TMP_DIR
if [ $? != 0 ]; then
    echo "an error occurs during: mkdir $TMP_DIR"
    exit 1
fi

# copy deb structure
cp -R $SRC_ROOT/deb/DEBIAN $TMP_DIR/
cp -R $SRC_ROOT/deb/etc $TMP_DIR/
cp -R $SRC_ROOT/deb/usr $TMP_DIR/

# etc
cp $SRC_ROOT/data/configuration.json $TMP_DIR/etc/pimp.json

# lib
cp $SRC_ROOT/*.js $TMP_DIR/usr/lib/pimp
cp -R $SRC_ROOT/lib $TMP_DIR/usr/lib/pimp
cp -R $SRC_ROOT/www $TMP_DIR/usr/lib/pimp

# share
cp $SRC_ROOT/data/* $TMP_DIR/usr/share/pimp
rm $TMP_DIR/usr/share/pimp/configuration.json


# cd $TMP_DIR

# make deb

# mv pimp_????.deb

# rm -Rf $TMP_DIR