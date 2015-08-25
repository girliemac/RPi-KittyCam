#include <errno.h>
#include <node.h>
#include <nan.h>
#include "./i2c-dev.h"
#include "./readword.h"
#include "./util.h"

static __s32 ReadWord(int fd, __u8 cmd) {
  return i2c_smbus_read_word_data(fd, cmd);
}

class ReadWordWorker : public NanAsyncWorker {
public:
  ReadWordWorker(NanCallback *callback, int fd, __u8 cmd)
    : NanAsyncWorker(callback), fd(fd), cmd(cmd) {}
  ~ReadWordWorker() {}

  void Execute() {
    word = ReadWord(fd, cmd);
    if (word == -1) {
      char buf[ERRBUFSZ];
      SetErrorMessage(strerror_r(errno, buf, ERRBUFSZ));
    }
  }

  void HandleOKCallback() {
    NanScope();

    v8::Local<v8::Value> argv[] = {
      NanNull(),
      NanNew<v8::Integer>(word)
    };

    callback->Call(2, argv);
  }

private:
  int fd;
  __u8 cmd;
  __s32 word;
};

NAN_METHOD(ReadWordAsync) {
  NanScope();

  if (args.Length() < 3 || !args[0]->IsInt32() || !args[1]->IsInt32() || !args[2]->IsFunction()) {
    return NanThrowError("incorrect arguments passed to readWord(int fd, int cmd, function cb)");
  }

  int fd = args[0]->Int32Value();
  __u8 cmd = args[1]->Int32Value();
  NanCallback *callback = new NanCallback(args[2].As<v8::Function>());

  NanAsyncQueueWorker(new ReadWordWorker(callback, fd, cmd));
  NanReturnUndefined();
}

NAN_METHOD(ReadWordSync) {
  NanScope();

  if (args.Length() < 2 || !args[0]->IsInt32() || !args[1]->IsInt32()) {
    return NanThrowError("incorrect arguments passed to readWordSync(int fd, int cmd)");
  }

  int fd = args[0]->Int32Value();
  __u8 cmd = args[1]->Int32Value();

  __s32 word = ReadWord(fd, cmd);
  if (word == -1) {
    char buf[ERRBUFSZ];
    return NanThrowError(strerror_r(errno, buf, ERRBUFSZ), errno);
  }

  NanReturnValue(NanNew<v8::Integer>(word));
}

