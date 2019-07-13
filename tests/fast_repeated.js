var tape = require("tape");

var protobuf  = require("..");

var proto = "syntax = \"proto3\";\
message RepDouble {\
    repeated double foo = 1;\
}\
\
message RepFloat {\
    repeated float foo = 1;\
}\
\
message RepFixed32 {\
    repeated fixed32 foo = 1;\
}\
\
message RepSFixed32 {\
    repeated sfixed32 foo = 1;\
}\
\
message RepFixed64 {\
    repeated fixed64 foo = 1;\
}\
\
message RepSFixed64 {\
    repeated sfixed64 foo = 1;\
}\
";

function testTypedArray(test, typeName, typedArray)
{
    var root = protobuf.parse(proto).root;

    var RepeatedType = root[typeName];
    var data = {foo: [1, 2, 3]};
    var buf = RepeatedType.encode(data).finish();
    var msg = RepeatedType.decode(buf);

    test.ok(msg.foo instanceof typedArray, `Array came back as ${typedArray}`);
    test.deepEqual(msg, data);
}

tape.test.only("readFixedAsTypedArray", function(test) {
    testTypedArray(test, 'RepFloat', Float32Array);
    testTypedArray(test, 'RepDouble', Float64Array);
    testTypedArray(test, 'RepFixed32', Uint32Array);
    testTypedArray(test, 'RepSFixed32', Int32Array);

    // NOTE: we dont' support BigUint64Array because access
    // requires the creation of BitInt's, which are arbitrary
    // precision integer types.
    //testTypedArray(test, 'RepFixed64', BigUint64Array);
    //testTypedArray(test, 'RepSFixed64', BigInt64Array);

    test.end();
});
