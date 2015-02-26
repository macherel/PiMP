#!/bin/bash

SRC_ROOT=".."
TMP_DIR=/tmp/pimp_deb_`date +%Y%m%d%H%M%S`

# creating temporary workspace
mkdir $TMP_DIR
if [ $? != 0 ]; then
    echo "an error occurs during: mkdir $TMP_DIR"
    exit 1
fi

##
# Creating structure
##

# DEBIAN
mkdir $TMP_DIR/DEBIAN
cp control $TMP_DIR/DEBIAN
cp postinst $TMP_DIR/DEBIAN
chmod 755 $TMP_DIR/DEBIAN/postinst

# etc
mkdir $TMP_DIR/etc
cp $SRC_ROOT/data/configuration.json $TMP_DIR/etc/pimp.json

# usr/bin
mkdir -p $TMP_DIR/usr/bin
cp pimp $TMP_DIR/usr/bin
chmod 755 $TMP_DIR/usr/bin/pimp

# usr/lib
mkdir -p $TMP_DIR/usr/lib/pimp
cp $SRC_ROOT/*.js $TMP_DIR/usr/lib/pimp
cp -R $SRC_ROOT/lib $TMP_DIR/usr/lib/pimp
cp -R $SRC_ROOT/www $TMP_DIR/usr/lib/pimp
ln -s $TMP_DIR/usr/share/pimp $TMP_DIR/usr/lib/pimp/data

# usr/share
mkdir -p $TMP_DIR/usr/share/pimp
cp $SRC_ROOT/data/* $TMP_DIR/usr/share/pimp
rm $TMP_DIR/usr/share/pimp/configuration.json
ln -s $TMP_DIR/etc/pimp.json $TMP_DIR/usr/share/pimp/configuration.json

##
# Creating deb file
##

# make deb
dpkg-deb -b $TMP_DIR $SRC_ROOT

##
# remove temporary files
##
rm -Rf $TMP_DIR
