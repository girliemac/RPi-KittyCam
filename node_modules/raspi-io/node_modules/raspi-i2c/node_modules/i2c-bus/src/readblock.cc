#include <errno.h>
#include <node.h>
#include <nan.h>
#include "./i2c-dev.h"
#include "./readblock.h"
#include "./util.h"

static __s32 ReadBlock(int fd, __u8 cmd, __u8 *block) {
  return i2c_smbus_read_block_data(fd, cmd, block);
}

class ReadBlockWorker : public NanAsyncWorker {
public:
  ReadBlockWorker(
    NanCallback *callback,
    int fd,
    __u8 cmd,
    __u8* block,
    v8::Local<v8::Object> &bufferHandle
  ) : NanAsyncWorker(callback), fd(fd), cmd(cmd), block(block), bytesRead(0) {
    SaveToPersistent("buffer", bufferHandle);
  }

  ~ReadBlockWorker() {}

  void Execute() {
    bytesRead = ReadBlock(fd, cmd, block);
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
  __u8* block;
  __s32 bytesRead;
};

NAN_METHOD(ReadBlockAsync) {
  NanScope();

  if (args.Length() < 4 ||
      !args[0]->IsInt32() ||
      !args[1]->IsInt32() ||
      !args[2]->IsObject() ||
      !args[3]->IsFunction()) {
    return NanThrowError("incorrect arguments passed to readBlock"
      "(int fd, int cmd, Buffer buffer, function cb)");
  }

  int fd = args[0]->Int32Value();
  __u8 cmd = args[1]->Int32Value();
  v8::Local<v8::Object> bufferHandle = args[2].As<v8::Object>();
  NanCallback *callback = new NanCallback(args[3].As<v8::Function>());

  __u8* bufferData = (__u8*) node::Buffer::Data(bufferHandle);
  size_t bufferLength = node::Buffer::Length(bufferHandle);

  if (bufferLength < 1) {
    return NanThrowError("buffer passed to readBlock "
      "has no space for reading data");
  }

  NanAsyncQueueWorker(new ReadBlockWorker(
    callback,
    fd,
    cmd,
    bufferData,
    bufferHandle
  ));

  NanReturnUndefined();
}

NAN_METHOD(ReadBlockSync) {
  NanScope();

  if (args.Length() < 3 ||
      !args[0]->IsInt32() ||
      !args[1]->IsInt32() ||
      !args[2]->IsObject()) {
    return NanThrowError("incorrect arguments passed to readBlockSync"
      "(int fd, int cmd, Buffer buffer)");
  }

  int fd = args[0]->Int32Value();
  __u8 cmd = args[1]->Int32Value();
  v8::Local<v8::Object> bufferHandle = args[2].As<v8::Object>();

  __u8* bufferData = (__u8*) node::Buffer::Data(bufferHandle);
  size_t bufferLength = node::Buffer::Length(bufferHandle);

  if (bufferLength < 1) {
    return NanThrowError("buffer passed to readBlockSync "
      "has no space for reading data");
  }

  __s32 bytesRead = ReadBlock(fd, cmd, bufferData);
  if (bytesRead == -1) {
    char buf[ERRBUFSZ];
    return NanThrowError(strerror_r(errno, buf, ERRBUFSZ), errno);
  }

  NanReturnValue(NanNew<v8::Integer>(bytesRead));
}

