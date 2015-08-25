#!/bin/sh

SCP_PASSWORD=`echo "123456789"`
echo $SCP_PASSWORD
expect -c "
set timeout 500;
spawn scp -r $1 root@eddie.local:/home/root/node_modules/johnny-five/$1
expect password: {send $SCP_PASSWORD\r }
expect 100%
sleep 1
exit
"
