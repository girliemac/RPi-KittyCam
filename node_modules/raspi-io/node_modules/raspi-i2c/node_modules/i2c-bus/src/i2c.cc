#include <node.h>
#include <nan.h>
#include "./i2cfuncs.h"
#include "./readbyte.h"
#include "./readword.h"
#include "./readblock.h"
#include "./readi2cblock.h"
#include "./receivebyte.h"
#include "./sendbyte.h"
#include "./setaddr.h"
#include "./writebyte.h"
#include "./writeword.h"
#include "./writeblock.h"
#include "./writei2cblock.h"
#include "./writequick.h"
#include "./i2c-dev.h"

void InitAll(v8::Handle<v8::Object> exports) {
  exports->Set(NanNew<v8::String>("i2cFuncsAsync"),
    NanNew<v8::FunctionTemplate>(I2cFuncsAsync)->GetFunction());
  exports->Set(NanNew<v8::String>("i2cFuncsSync"),
    NanNew<v8::FunctionTemplate>(I2cFuncsSync)->GetFunction());

  exports->Set(NanNew<v8::String>("readByteAsync"),
    NanNew<v8::FunctionTemplate>(ReadByteAsync)->GetFunction());
  exports->Set(NanNew<v8::String>("readByteSync"),
    NanNew<v8::FunctionTemplate>(ReadByteSync)->GetFunction());

  exports->Set(NanNew<v8::String>("readWordAsync"),
    NanNew<v8::FunctionTemplate>(ReadWordAsync)->GetFunction());
  exports->Set(NanNew<v8::String>("readWordSync"),
    NanNew<v8::FunctionTemplate>(ReadWordSync)->GetFunction());

  exports->Set(NanNew<v8::String>("readBlockAsync"),
    NanNew<v8::FunctionTemplate>(ReadBlockAsync)->GetFunction());
  exports->Set(NanNew<v8::String>("readBlockSync"),
    NanNew<v8::FunctionTemplate>(ReadBlockSync)->GetFunction());

  exports->Set(NanNew<v8::String>("readI2cBlockAsync"),
    NanNew<v8::FunctionTemplate>(ReadI2cBlockAsync)->GetFunction());
  exports->Set(NanNew<v8::String>("readI2cBlockSync"),
    NanNew<v8::FunctionTemplate>(ReadI2cBlockSync)->GetFunction());

  exports->Set(NanNew<v8::String>("receiveByteAsync"),
    NanNew<v8::FunctionTemplate>(ReceiveByteAsync)->GetFunction());
  exports->Set(NanNew<v8::String>("receiveByteSync"),
    NanNew<v8::FunctionTemplate>(ReceiveByteSync)->GetFunction());

  exports->Set(NanNew<v8::String>("sendByteAsync"),
    NanNew<v8::FunctionTemplate>(SendByteAsync)->GetFunction());
  exports->Set(NanNew<v8::String>("sendByteSync"),
    NanNew<v8::FunctionTemplate>(SendByteSync)->GetFunction());

  exports->Set(NanNew<v8::String>("setAddrAsync"),
    NanNew<v8::FunctionTemplate>(SetAddrAsync)->GetFunction());
  exports->Set(NanNew<v8::String>("setAddrSync"),
    NanNew<v8::FunctionTemplate>(SetAddrSync)->GetFunction());

  exports->Set(NanNew<v8::String>("writeByteAsync"),
    NanNew<v8::FunctionTemplate>(WriteByteAsync)->GetFunction());
  exports->Set(NanNew<v8::String>("writeByteSync"),
    NanNew<v8::FunctionTemplate>(WriteByteSync)->GetFunction());

  exports->Set(NanNew<v8::String>("writeWordAsync"),
    NanNew<v8::FunctionTemplate>(WriteWordAsync)->GetFunction());
  exports->Set(NanNew<v8::String>("writeWordSync"),
    NanNew<v8::FunctionTemplate>(WriteWordSync)->GetFunction());

  exports->Set(NanNew<v8::String>("writeBlockAsync"),
    NanNew<v8::FunctionTemplate>(WriteBlockAsync)->GetFunction());
  exports->Set(NanNew<v8::String>("writeBlockSync"),
    NanNew<v8::FunctionTemplate>(WriteBlockSync)->GetFunction());

  exports->Set(NanNew<v8::String>("writeI2cBlockAsync"),
    NanNew<v8::FunctionTemplate>(WriteI2cBlockAsync)->GetFunction());
  exports->Set(NanNew<v8::String>("writeI2cBlockSync"),
    NanNew<v8::FunctionTemplate>(WriteI2cBlockSync)->GetFunction());

  exports->Set(NanNew<v8::String>("writeQuickAsync"),
    NanNew<v8::FunctionTemplate>(WriteQuickAsync)->GetFunction());
  exports->Set(NanNew<v8::String>("writeQuickSync"),
    NanNew<v8::FunctionTemplate>(WriteQuickSync)->GetFunction());

  exports->Set(NanNew<v8::String>("I2C_FUNC_I2C"),
    NanNew<v8::Integer>(I2C_FUNC_I2C));
  exports->Set(NanNew<v8::String>("I2C_FUNC_10BIT_ADDR"),
    NanNew<v8::Integer>(I2C_FUNC_10BIT_ADDR));
  exports->Set(NanNew<v8::String>("I2C_FUNC_PROTOCOL_MANGLING"),
    NanNew<v8::Integer>(I2C_FUNC_PROTOCOL_MANGLING));
  exports->Set(NanNew<v8::String>("I2C_FUNC_SMBUS_PEC"),
    NanNew<v8::Integer>(I2C_FUNC_SMBUS_PEC));
  exports->Set(NanNew<v8::String>("I2C_FUNC_SMBUS_BLOCK_PROC_CALL"),
    NanNew<v8::Integer>(I2C_FUNC_SMBUS_BLOCK_PROC_CALL));
  exports->Set(NanNew<v8::String>("I2C_FUNC_SMBUS_QUICK"),
    NanNew<v8::Integer>(I2C_FUNC_SMBUS_QUICK));
  exports->Set(NanNew<v8::String>("I2C_FUNC_SMBUS_READ_BYTE"),
    NanNew<v8::Integer>(I2C_FUNC_SMBUS_READ_BYTE));
  exports->Set(NanNew<v8::String>("I2C_FUNC_SMBUS_WRITE_BYTE"),
    NanNew<v8::Integer>(I2C_FUNC_SMBUS_WRITE_BYTE));
  exports->Set(NanNew<v8::String>("I2C_FUNC_SMBUS_READ_BYTE_DATA"),
    NanNew<v8::Integer>(I2C_FUNC_SMBUS_READ_BYTE_DATA));
  exports->Set(NanNew<v8::String>("I2C_FUNC_SMBUS_WRITE_BYTE_DATA"),
    NanNew<v8::Integer>(I2C_FUNC_SMBUS_WRITE_BYTE_DATA));
  exports->Set(NanNew<v8::String>("I2C_FUNC_SMBUS_READ_WORD_DATA"),
    NanNew<v8::Integer>(I2C_FUNC_SMBUS_READ_WORD_DATA));
  exports->Set(NanNew<v8::String>("I2C_FUNC_SMBUS_WRITE_WORD_DATA"),
    NanNew<v8::Integer>(I2C_FUNC_SMBUS_WRITE_WORD_DATA));
  exports->Set(NanNew<v8::String>("I2C_FUNC_SMBUS_PROC_CALL"),
    NanNew<v8::Integer>(I2C_FUNC_SMBUS_PROC_CALL));
  exports->Set(NanNew<v8::String>("I2C_FUNC_SMBUS_READ_BLOCK_DATA"),
    NanNew<v8::Integer>(I2C_FUNC_SMBUS_READ_BLOCK_DATA));
  exports->Set(NanNew<v8::String>("I2C_FUNC_SMBUS_WRITE_BLOCK_DATA"),
    NanNew<v8::Integer>(I2C_FUNC_SMBUS_WRITE_BLOCK_DATA));
  exports->Set(NanNew<v8::String>("I2C_FUNC_SMBUS_READ_I2C_BLOCK"),
    NanNew<v8::Integer>(I2C_FUNC_SMBUS_READ_I2C_BLOCK));
  exports->Set(NanNew<v8::String>("I2C_FUNC_SMBUS_WRITE_I2C_BLOCK"),
    NanNew<v8::Integer>(I2C_FUNC_SMBUS_WRITE_I2C_BLOCK));
}

NODE_MODULE(i2c, InitAll)

// Hack to speed up compilation.
// Originally all the cc files included below were listed in the sources
// section of binding.gyp. Including them here rather than compiling them
// individually, which is what happens if they're listed in binding.gyp,
// reduces the build time from 36s to 15s on a BBB.
#include "./i2cfuncs.cc"
#include "./readbyte.cc"
#include "./readword.cc"
#include "./readblock.cc"
#include "./readi2cblock.cc"
#include "./receivebyte.cc"
#include "./sendbyte.cc"
#include "./setaddr.cc"
#include "./writebyte.cc"
#include "./writeword.cc"
#include "./writeblock.cc"
#include "./writei2cblock.cc"
#include "./writequick.cc"

