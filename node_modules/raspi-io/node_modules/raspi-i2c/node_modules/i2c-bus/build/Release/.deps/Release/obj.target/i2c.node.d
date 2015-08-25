cmd_Release/obj.target/i2c.node := g++ -shared -pthread -rdynamic  -Wl,-soname=i2c.node -o Release/obj.target/i2c.node -Wl,--start-group Release/obj.target/i2c/src/i2c.o -Wl,--end-group 
