#include <errno.h>
#include <node.h>
#include <nan.h>
#include "./i2c-dev.h"
#include "./i2cfuncs.h"
#include "./util.h"

static __s32 I2cFuncs(int fd, unsigned long *i2cfuncs) {
  return ioctl(fd, I2C_FUNCS, i2cfuncs);
}

class I2cFuncsWorker : public NanAsyncWorker {
public:
  I2cFuncsWorker(NanCallback *callback, int fd)
    : NanAsyncWorker(callback), fd(fd) {}
  ~I2cFuncsWorker() {}

  void Execute() {
    __s32 ret = I2cFuncs(fd, &i2cfuncs);
    if (ret == -1) {
      char buf[ERRBUFSZ];
      SetErrorMessage(strerror_r(errno, buf, ERRBUFSZ));
    }
  }

  void HandleOKCallback() {
    NanScope();

    v8::Local<v8::Value> argv[] = {
      NanNull(),
      NanNew<v8::Uint32>(static_cast<unsigned int>(i2cfuncs))
    };

    callback->Call(2, argv);
  }

private:
  int fd;
  unsigned long i2cfuncs;
};

NAN_METHOD(I2cFuncsAsync) {
  NanScope();

  if (args.Length() < 2 || !args[0]->IsInt32() || !args[1]->IsFunction()) {
    return NanThrowError("incorrect arguments passed to i2cFuncs(int fd, function cb)");
  }

  int fd = args[0]->Int32Value();
  NanCallback *callback = new NanCallback(args[1].As<v8::Function>());

  NanAsyncQueueWorker(new I2cFuncsWorker(callback, fd));
  NanReturnUndefined();
}

NAN_METHOD(I2cFuncsSync) {
  NanScope();

  if (args.Length() < 1 || !args[0]->IsInt32()) {
    return NanThrowError("incorrect arguments passed to i2cFuncsSync(int fd)");
  }

  int fd = args[0]->Int32Value();

  unsigned long i2cfuncs;
  __s32 ret = I2cFuncs(fd, &i2cfuncs);
  if (ret == -1) {
    char buf[ERRBUFSZ];
    return NanThrowError(strerror_r(errno, buf, ERRBUFSZ), errno);
  }

  NanReturnValue(NanNew<v8::Uint32>(static_cast<unsigned int>(i2cfuncs)));
}

