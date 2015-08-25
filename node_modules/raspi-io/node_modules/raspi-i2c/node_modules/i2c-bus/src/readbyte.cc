#include <errno.h>
#include <node.h>
#include <nan.h>
#include "./i2c-dev.h"
#include "./readbyte.h"
#include "./util.h"

static __s32 ReadByte(int fd, __u8 cmd) {
  return i2c_smbus_read_byte_data(fd, cmd);
}

class ReadByteWorker : public NanAsyncWorker {
public:
  ReadByteWorker(NanCallback *callback, int fd, __u8 cmd)
    : NanAsyncWorker(callback), fd(fd), cmd(cmd) {}
  ~ReadByteWorker() {}

  void Execute() {
    byte = ReadByte(fd, cmd);
    if (byte == -1) {
      char buf[ERRBUFSZ];
      SetErrorMessage(strerror_r(errno, buf, ERRBUFSZ));
    }
  }

  void HandleOKCallback() {
    NanScope();

    v8::Local<v8::Value> argv[] = {
      NanNull(),
      NanNew<v8::Integer>(byte)
    };

    callback->Call(2, argv);
  }

private:
  int fd;
  __u8 cmd;
  __s32 byte;
};

NAN_METHOD(ReadByteAsync) {
  NanScope();

  if (args.Length() < 3 || !args[0]->IsInt32() || !args[1]->IsInt32() || !args[2]->IsFunction()) {
    return NanThrowError("incorrect arguments passed to readByte(int fd, int cmd, function cb)");
  }

  int fd = args[0]->Int32Value();
  __u8 cmd = args[1]->Int32Value();
  NanCallback *callback = new NanCallback(args[2].As<v8::Function>());

  NanAsyncQueueWorker(new ReadByteWorker(callback, fd, cmd));
  NanReturnUndefined();
}

NAN_METHOD(ReadByteSync) {
  NanScope();

  if (args.Length() < 2 || !args[0]->IsInt32() || !args[1]->IsInt32()) {
    return NanThrowError("incorrect arguments passed to readByteSync(int fd, int cmd)");
  }

  int fd = args[0]->Int32Value();
  __u8 cmd = args[1]->Int32Value();

  __s32 byte = ReadByte(fd, cmd);
  if (byte == -1) {
    char buf[ERRBUFSZ];
    return NanThrowError(strerror_r(errno, buf, ERRBUFSZ), errno);
  }

  NanReturnValue(NanNew<v8::Integer>(byte));
}

