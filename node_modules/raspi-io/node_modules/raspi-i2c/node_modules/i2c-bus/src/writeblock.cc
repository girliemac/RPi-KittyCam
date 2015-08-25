#include <errno.h>
#include <node.h>
#include <nan.h>
#include "./i2c-dev.h"
#include "./writeblock.h"
#include "./util.h"

#include <stdio.h>

static __s32 WriteBlock(int fd, __u8 cmd, __u8 length, const __u8 *block) {
  return i2c_smbus_write_block_data(fd, cmd, length, block);
}

class WriteBlockWorker : public NanAsyncWorker {
public:
  WriteBlockWorker(
    NanCallback *callback,
    int fd,
    __u8 cmd,
    __u32 length,
    const __u8* block,
    v8::Local<v8::Object> &bufferHandle
  ) : NanAsyncWorker(callback), fd(fd), cmd(cmd), length(length), block(block) {
    SaveToPersistent("buffer", bufferHandle);
  }

  ~WriteBlockWorker() {}

  void Execute() {
    __s32 ret = WriteBlock(fd, cmd, length, block);
    if (ret == -1) {
      char buf[ERRBUFSZ];
      SetErrorMessage(strerror_r(errno, buf, ERRBUFSZ));
    }
  }

  void HandleOKCallback() {
    NanScope();

    v8::Local<v8::Object> bufferHandle = GetFromPersistent("buffer");

    v8::Local<v8::Value> argv[] = {
      NanNull(),
      NanNew<v8::Integer>(length),
      bufferHandle
    };

    callback->Call(3, argv);
  }

private:
  int fd;
  __u8 cmd;
  __u32 length;
  const __u8* block;
};

NAN_METHOD(WriteBlockAsync) {
  NanScope();

  if (args.Length() < 5 ||
      !args[0]->IsInt32() ||
      !args[1]->IsInt32() ||
      !args[2]->IsUint32() ||
      !args[3]->IsObject() ||
      !args[4]->IsFunction()) {
    return NanThrowError("incorrect arguments passed to writeBlock"
      "(int fd, int cmd, int length, Buffer buffer, function cb)");
  }

  int fd = args[0]->Int32Value();
  __u8 cmd = args[1]->Int32Value();
  __u32 length = args[2]->Uint32Value();
  v8::Local<v8::Object> bufferHandle = args[3].As<v8::Object>();
  NanCallback *callback = new NanCallback(args[4].As<v8::Function>());

  const __u8* bufferData = (const __u8*) node::Buffer::Data(bufferHandle);
  size_t bufferLength = node::Buffer::Length(bufferHandle);

  if (length > I2C_SMBUS_I2C_BLOCK_MAX) {
    return NanThrowError("writeBlock can't write blocks "
      "with more than 32 characters");
  }

  if (length > bufferLength) {
    return NanThrowError("buffer passed to writeBlock "
      "contains less than 'length' bytes");
  }

  NanAsyncQueueWorker(new WriteBlockWorker(
    callback,
    fd,
    cmd,
    length,
    bufferData,
    bufferHandle
  ));
  NanReturnUndefined();
}

NAN_METHOD(WriteBlockSync) {
  NanScope();

  if (args.Length() < 4 ||
      !args[0]->IsInt32() ||
      !args[1]->IsInt32() ||
      !args[2]->IsUint32() ||
      !args[3]->IsObject()) {
    return NanThrowError("incorrect arguments passed to writeBlockSync"
      "(int fd, int cmd, int length, Buffer buffer)");
  }

  int fd = args[0]->Int32Value();
  __u8 cmd = args[1]->Int32Value();
  __u32 length = args[2]->Uint32Value();
  v8::Local<v8::Object> bufferHandle = args[3].As<v8::Object>();

  const __u8* bufferData = (const __u8*) node::Buffer::Data(bufferHandle);
  size_t bufferLength = node::Buffer::Length(bufferHandle);

  if (length > I2C_SMBUS_I2C_BLOCK_MAX) {
    return NanThrowError("writeBlockSync can't write blocks "
      "with more than 32 bytes");
  }

  if (length > bufferLength) {
    return NanThrowError("buffer passed to writeBlockSync "
      "contains less than 'length' bytes");
  }

  __s32 ret = WriteBlock(fd, cmd, length, bufferData);
  if (ret == -1) {
    char buf[ERRBUFSZ];
    return NanThrowError(strerror_r(errno, buf, ERRBUFSZ), errno);
  }

  NanReturnUndefined();
}

