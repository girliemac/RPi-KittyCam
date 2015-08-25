#include <errno.h>
#include <node.h>
#include <nan.h>
#include "./i2c-dev.h"
#include "./writeword.h"
#include "./util.h"

static __s32 WriteWord(int fd, __u8 cmd, __u16 word) {
  return i2c_smbus_write_word_data(fd, cmd, word);
}

class WriteWordWorker : public NanAsyncWorker {
public:
  WriteWordWorker(NanCallback *callback, int fd, __u8 cmd, __u16 word)
    : NanAsyncWorker(callback), fd(fd), cmd(cmd), word(word) {}
  ~WriteWordWorker() {}

  void Execute() {
    __s32 ret = WriteWord(fd, cmd, word);
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
  __u8 cmd;
  __u16 word;
};

NAN_METHOD(WriteWordAsync) {
  NanScope();

  if (args.Length() < 4 || !args[0]->IsInt32() || !args[1]->IsInt32() || !args[2]->IsInt32() || !args[3]->IsFunction()) {
    return NanThrowError("incorrect arguments passed to writeWord(int fd, int cmd, int word, function cb)");
  }

  int fd = args[0]->Int32Value();
  __u8 cmd = args[1]->Int32Value();
  __u16 word = args[2]->Int32Value();
  NanCallback *callback = new NanCallback(args[3].As<v8::Function>());

  NanAsyncQueueWorker(new WriteWordWorker(callback, fd, cmd, word));
  NanReturnUndefined();
}

NAN_METHOD(WriteWordSync) {
  NanScope();

  if (args.Length() < 3 || !args[0]->IsInt32() || !args[1]->IsInt32() || !args[2]->IsInt32()) {
    char buf[ERRBUFSZ];
    return NanThrowError(strerror_r(errno, buf, ERRBUFSZ), errno);
  }

  int fd = args[0]->Int32Value();
  __u8 cmd = args[1]->Int32Value();
  __u16 word = args[2]->Int32Value();

  __s32 ret = WriteWord(fd, cmd, word);
  if (ret == -1) {
    char buf[ERRBUFSZ];
    return NanThrowError(strerror_r(errno, buf, ERRBUFSZ), errno);
  }

  NanReturnUndefined();
}

