var tape = require("tape");

var protobuf  = require("..");

var proto = "syntax = \"proto3\";\
message Rep {\
    repeated double foo = 1;\
}\
\
message Bytes {\
    bytes foo = 1;\
}";

tape.test("fastRepeatedDouble", function(test) {
    var root = protobuf.parse(proto).root;

    // Repeated
    var Rep = root.Rep;
    var data = {foo: [1, 2, 3]};
    var buf = Rep.encode(data).finish();
    var msg = Rep.decode(buf);
    var resObj = Rep.toObject(msg);
    test.deepEqual(data, resObj);

    // Bytes
    var Bytes = root.Bytes;
    var array = new Float64Array(3);
    array.set(data.foo);
    var arrayData = {foo: array};
    var arrBuf = Bytes.encode(arrayData).finish();
    var arrMsg = Bytes.decode(arrBuf);
    var arrResObj = Bytes.toObject(arrMsg);
    test.deepEqual(arrayData, arrResObj);

    test.end();
});
