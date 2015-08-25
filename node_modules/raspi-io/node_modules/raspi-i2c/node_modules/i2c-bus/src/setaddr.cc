#include <errno.h>
#include <node.h>
#include <nan.h>
#include "./i2c-dev.h"
#include "./setaddr.h"
#include "./util.h"

static int SetAddr(int fd, int addr) {
  return ioctl(fd, I2C_SLAVE, addr);
}

class SetAddrWorker : public NanAsyncWorker {
public:
  SetAddrWorker(NanCallback *callback, int fd, int addr)
    : NanAsyncWorker(callback), fd(fd), addr(addr) {}
  ~SetAddrWorker() {}

  void Execute() {
    if (SetAddr(fd, addr) == -1) {
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
  int addr;
};

NAN_METHOD(SetAddrAsync) {
  NanScope();

  if (args.Length() < 3 || !args[0]->IsInt32() || !args[1]->IsInt32() || !args[2]->IsFunction()) {
    return NanThrowError("incorrect arguments passed to setAddr(int fd, int addr, function cb)");
  }

  int fd = args[0]->Int32Value();
  int addr = args[1]->Int32Value();
  NanCallback *callback = new NanCallback(args[2].As<v8::Function>());

  NanAsyncQueueWorker(new SetAddrWorker(callback, fd, addr));
  NanReturnUndefined();
}

NAN_METHOD(SetAddrSync) {
  NanScope();

  if (args.Length() < 2 || !args[0]->IsInt32() || !args[1]->IsInt32()) {
    return NanThrowError("incorrect arguments passed to setAddrSync(int fd, int addr)");
  }

  int fd = args[0]->Int32Value();
  int addr = args[1]->Int32Value();

  if (SetAddr(fd, addr) != 0) {
    char buf[ERRBUFSZ];
    return NanThrowError(strerror_r(errno, buf, ERRBUFSZ), errno);
  }

  NanReturnUndefined();
}

