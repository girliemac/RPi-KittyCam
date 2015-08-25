#include <errno.h>
#include <node.h>
#include <nan.h>
#include "./i2c-dev.h"
#include "./sendbyte.h"
#include "./util.h"

static __s32 SendByte(int fd, __u8 byte) {
  return i2c_smbus_write_byte(fd, byte);
}

class SendByteWorker : public NanAsyncWorker {
public:
  SendByteWorker(NanCallback *callback, int fd, __u8 byte)
    : NanAsyncWorker(callback), fd(fd), byte(byte) {}
  ~SendByteWorker() {}

  void Execute() {
    __s32 ret = SendByte(fd, byte);
    if (ret == -1) {
      char buf[ERRBUFSZ];
      SetErrorMessage(strerror_r(errno, buf, ERRBUFSZ));
    }
  }

  void HandleOKCallback() {
    NanScope();

    v8::Local<v8::Value> argv[] = {
      NanNull()
    };

    callback->Call(1, argv);
  }

private:
  int fd;
  __u8 byte;
};

NAN_METHOD(SendByteAsync) {
  NanScope();

  if (args.Length() < 3 || !args[0]->IsInt32() || !args[1]->IsInt32() || !args[2]->IsFunction()) {
    return NanThrowError("incorrect arguments passed to sendByte(int fd, int byte, function cb)");
  }

  int fd = args[0]->Int32Value();
  __u8 byte = args[1]->Int32Value();
  NanCallback *callback = new NanCallback(args[2].As<v8::Function>());

  NanAsyncQueueWorker(new SendByteWorker(callback, fd, byte));
  NanReturnUndefined();
}

NAN_METHOD(SendByteSync) {
  NanScope();

  if (args.Length() < 2 || !args[0]->IsInt32() || !args[1]->IsInt32()) {
    return NanThrowError("incorrect arguments passed to sendByteSync(int fd, int byte)");
  }

  int fd = args[0]->Int32Value();
  __u8 byte = args[1]->Int32Value();

  __s32 ret = SendByte(fd, byte);
  if (ret == -1) {
    char buf[ERRBUFSZ];
    return NanThrowError(strerror_r(errno, buf, ERRBUFSZ), errno);
  }

  NanReturnUndefined();
}

