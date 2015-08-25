#include <errno.h>
#include <node.h>
#include <nan.h>
#include "./i2c-dev.h"
#include "./readi2cblock.h"
#include "./util.h"

static __s32 ReadI2cBlock(int fd, __u8 cmd, __u8 length, __u8 *block) {
  return i2c_smbus_read_i2c_block_data(fd, cmd, length, block);
}

class ReadI2cBlockWorker : public NanAsyncWorker {
public:
  ReadI2cBlockWorker(
    NanCallback *callback,
    int fd,
    __u8 cmd,
    __u32 length,
    __u8* block,
    v8::Local<v8::Object> &bufferHandle
  ) : NanAsyncWorker(callback), fd(fd), cmd(cmd), length(length), block(block), bytesRead(0) {
    SaveToPersistent("buffer", bufferHandle);
  }

  ~ReadI2cBlockWorker() {}

  void Execute() {
    bytesRead = ReadI2cBlock(fd, cmd, length, block);
    if (bytesRead == -1) {
      char buf[ERRBUFSZ];
      SetErrorMessage(strerror_r(errno, buf, ERRBUFSZ));
    }
  }

  void HandleOKCallback() {
    NanScope();

    v8::Local<v8::Object> bufferHandle = GetFromPersistent("buffer");

    v8::Local<v8::Value> argv[] = {
      NanNull(),
      NanNew<v8::Integer>(bytesRead),
      bufferHandle
    };

    callback->Call(3, argv);
  }

private:
  int fd;
  __u8 cmd;
  __u32 length;
  __u8* block;
  __s32 bytesRead;
};

NAN_METHOD(ReadI2cBlockAsync) {
  NanScope();

  if (args.Length() < 5 ||
      !args[0]->IsInt32() ||
      !args[1]->IsInt32() ||
      !args[2]->IsUint32() ||
      !args[3]->IsObject() ||
      !args[4]->IsFunction()) {
    return NanThrowError("incorrect arguments passed to readI2cBlock"
      "(int fd, int cmd, int length, Buffer buffer, function cb)");
  }

  int fd = args[0]->Int32Value();
  __u8 cmd = args[1]->Int32Value();
  __u32 length = args[2]->Uint32Value();
  v8::Local<v8::Object> bufferHandle = args[3].As<v8::Object>();
  NanCallback *callback = new NanCallback(args[4].As<v8::Function>());

  __u8* bufferData = (__u8*) node::Buffer::Data(bufferHandle);
  size_t bufferLength = node::Buffer::Length(bufferHandle);

  if (length > I2C_SMBUS_I2C_BLOCK_MAX) {
    return NanThrowError("readI2cBlock can't read blocks "
      "with more than 32 characters");
  }

  if (length > bufferLength) {
    return NanThrowError("buffer passed to readI2cBlock "
      "contains less than 'length' bytes");
  }

  NanAsyncQueueWorker(new ReadI2cBlockWorker(
    callback,
    fd,
    cmd,
    length,
    bufferData,
    bufferHandle
  ));
  NanReturnUndefined();
}

NAN_METHOD(ReadI2cBlockSync) {
  NanScope();

  if (args.Length() < 4 ||
      !args[0]->IsInt32() ||
      !args[1]->IsInt32() ||
      !args[2]->IsUint32() ||
      !args[3]->IsObject()) {
    return NanThrowError("incorrect arguments passed to readI2cBlockSync"
      "(int fd, int cmd, int length, Buffer buffer)");
  }

  int fd = args[0]->Int32Value();
  __u8 cmd = args[1]->Int32Value();
  __u32 length = args[2]->Uint32Value();
  v8::Local<v8::Object> bufferHandle = args[3].As<v8::Object>();

  __u8* bufferData = (__u8*) node::Buffer::Data(bufferHandle);
  size_t bufferLength = node::Buffer::Length(bufferHandle);

  if (length > I2C_SMBUS_I2C_BLOCK_MAX) {
    return NanThrowError("readI2cBlockSync can't read blocks "
      "with more than 32 bytes");
  }

  if (length > bufferLength) {
    return NanThrowError("buffer passed to readI2cBlockSync "
      "contains less than 'length' bytes");
  }

  __s32 bytesRead = ReadI2cBlock(fd, cmd, length, bufferData);
  if (bytesRead == -1) {
    char buf[ERRBUFSZ];
    return NanThrowError(strerror_r(errno, buf, ERRBUFSZ), errno);
  }

  NanReturnValue(NanNew<v8::Integer>(bytesRead));
}

