#include <errno.h>
#include <node.h>
#include <nan.h>
#include "./i2c-dev.h"
#include "./receivebyte.h"
#include "./util.h"

static __s32 ReceiveByte(int fd) {
  return i2c_smbus_read_byte(fd);
}

class ReceiveByteWorker : public NanAsyncWorker {
public:
  ReceiveByteWorker(NanCallback *callback, int fd)
    : NanAsyncWorker(callback), fd(fd) {}
  ~ReceiveByteWorker() {}

  void Execute() {
    byte = ReceiveByte(fd);
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
  __s32 byte;
};

NAN_METHOD(ReceiveByteAsync) {
  NanScope();

  if (args.Length() < 2 || !args[0]->IsInt32() || !args[1]->IsFunction()) {
    return NanThrowError("incorrect arguments passed to receiveByte(int fd, function cb)");
  }

  int fd = args[0]->Int32Value();
  NanCallback *callback = new NanCallback(args[1].As<v8::Function>());

  NanAsyncQueueWorker(new ReceiveByteWorker(callback, fd));
  NanReturnUndefined();
}

NAN_METHOD(ReceiveByteSync) {
  NanScope();

  if (args.Length() < 1 || !args[0]->IsInt32()) {
    return NanThrowError("incorrect arguments passed to receiveByteSync(int fd)");
  }

  int fd = args[0]->Int32Value();

  __s32 byte = ReceiveByte(fd);
  if (byte == -1) {
    char buf[ERRBUFSZ];
    return NanThrowError(strerror_r(errno, buf, ERRBUFSZ), errno);
  }

  NanReturnValue(NanNew<v8::Integer>(byte));
}

