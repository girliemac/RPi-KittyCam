#include <errno.h>
#include <node.h>
#include <nan.h>
#include "./i2c-dev.h"
#include "./writequick.h"
#include "./util.h"

static __s32 WriteQuick(int fd, __u8 bit) {
  return i2c_smbus_write_quick(fd, bit);
}

class WriteQuickWorker : public NanAsyncWorker {
public:
  WriteQuickWorker(NanCallback *callback, int fd, __u8 bit)
    : NanAsyncWorker(callback), fd(fd), bit(bit) {}
  ~WriteQuickWorker() {}

  void Execute() {
    __s32 ret = WriteQuick(fd, bit);
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
  __u8 bit;
};

NAN_METHOD(WriteQuickAsync) {
  NanScope();

  if (args.Length() < 3 || !args[0]->IsInt32() || !args[1]->IsInt32() || !args[3]->IsFunction()) {
    return NanThrowError("incorrect arguments passed to writeQuick(int fd, int bit, function cb)");
  }

  int fd = args[0]->Int32Value();
  __u8 bit = args[1]->Int32Value();
  NanCallback *callback = new NanCallback(args[2].As<v8::Function>());

  NanAsyncQueueWorker(new WriteQuickWorker(callback, fd, bit));
  NanReturnUndefined();
}

NAN_METHOD(WriteQuickSync) {
  NanScope();

  if (args.Length() < 2 || !args[0]->IsInt32() || !args[1]->IsInt32()) {
    return NanThrowError("incorrect arguments passed to writeQuickSync(int fd, int bit)");
  }

  int fd = args[0]->Int32Value();
  __u8 bit = args[1]->Int32Value();

  __s32 ret = WriteQuick(fd, bit);
  if (ret == -1) {
    char buf[ERRBUFSZ];
    return NanThrowError(strerror_r(errno, buf, ERRBUFSZ), errno);
  }

  NanReturnUndefined();
}

